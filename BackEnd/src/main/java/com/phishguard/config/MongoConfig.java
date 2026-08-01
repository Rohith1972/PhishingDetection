package com.phishguard.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {

    @Value("${spring.data.mongodb.uri:mongodb://localhost:27017/phishguard}")
    private String mongoUri;

    @Bean
    public MongoClient mongoClient() {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .build();
        return MongoClients.create(mongoClientSettings);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        String databaseName = connectionString.getDatabase();
        if (databaseName == null || databaseName.isBlank()) {
            databaseName = "phishguard";
        }
        return new MongoTemplate(new SimpleMongoClientDatabaseFactory(mongoClient(), databaseName));
    }
}
