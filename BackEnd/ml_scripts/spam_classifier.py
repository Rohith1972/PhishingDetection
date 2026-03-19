import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import argparse
import joblib
import os

MODEL_DIR = os.getenv("MODEL_DIR", "/app/ml_data")

def load_and_preprocess_data(filepath):
    try:
        # Load the dataset, handling potential encoding issues common with this dataset
        df = pd.read_csv(filepath, encoding='latin-1')
        
        # Keep only the necessary columns and rename them 
        df = df[['v1', 'v2']]
        df.columns = ['label', 'text']
        
        # Convert labels to binary (spam = 1, ham = 0)
        df['label'] = df['label'].map({'spam': 1, 'ham': 0})
        
        return df
    except FileNotFoundError:
        print(f"Error: The file {filepath} was not found.")
        return None

def train_and_evaluate(df):
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label'], test_size=0.2, random_state=42)
    
    # Convert text to TF-IDF features
    print("Vectorizing text data...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    # 2. Train Support Vector Machine (Often yields highest accuracy for text with TF-IDF)
    print("\n--- Training Support Vector Machine (SVC) ---")
    svm_clf = SVC(kernel='linear', C=1.0)
    svm_clf.fit(X_train_tfidf, y_train)
    svm_pred = svm_clf.predict(X_test_tfidf)
    print(f"Accuracy: {accuracy_score(y_test, svm_pred):.4f}")
    print("Classification Report:")
    print(classification_report(y_test, svm_pred, target_names=['Ham', 'Spam']))
    
    # Save the best model and vectorizer for future use
    # We will save the SVM model as it usually performs slightly better on text
    os.makedirs(MODEL_DIR, exist_ok=True)
    svm_path = os.path.join(MODEL_DIR, 'spam_svm_model.pkl')
    vec_path = os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl')
    
    print("\nSaving the SVM model and vectorizer...")
    joblib.dump(svm_clf, svm_path)
    joblib.dump(vectorizer, vec_path)
    print(f"Models saved as '{svm_path}' and '{vec_path}'")

def predict_message(text, model_path=os.path.join(MODEL_DIR, 'spam_svm_model.pkl'), vectorizer_path=os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl')):
    try:
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
    except FileNotFoundError:
        print("Model files not found. Please train the model first.")
        # If model is not found, we exit cleanly so Java backend knows.
        import sys
        sys.exit(2)
        return
    
    text_tfidf = vectorizer.transform([text])
    prediction = model.predict(text_tfidf)
    
    # Important: Only print exactly the string "SPAM" or "HAM" to easily parse in Java
    if prediction[0] == 1:
        print("SPAM")
    else:
        print("HAM")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Spam Classification Script")
    parser.add_argument('--train', action='store_true', help='Train models using spam.csv')
    parser.add_argument('--predict', type=str, help='Text message to classify')
    
    args = parser.parse_args()
    
    if args.train:
        print("Loading data...")
        csv_path = os.path.join(MODEL_DIR, 'spam.csv')
        df = load_and_preprocess_data(csv_path)
        if df is not None:
            train_and_evaluate(df)
    elif args.predict:
        predict_message(args.predict)
    else:
        print("Please specify an action.")
