package com.phishguard.service;

import com.phishguard.dto.JwtAuthenticationResponse;
import com.phishguard.dto.LoginRequest;
import com.phishguard.dto.SignUpRequest;
import com.phishguard.entity.AuthProvider;
import com.phishguard.entity.Role;
import com.phishguard.entity.User;
import com.phishguard.exception.ApiException;
import com.phishguard.repository.UserRepository;
import com.phishguard.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        return new JwtAuthenticationResponse(jwt, user.getId(), user.getName(), user.getEmail());
    }

    public void registerUser(SignUpRequest signUpRequest) {
        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email Address already in use!");
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(Role.ROLE_USER)
                .provider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);
    }
    
    // Fallback logic for OAuth (mocked for brevity)
    public JwtAuthenticationResponse oauthLogin(String email, String name, AuthProvider provider) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                .name(name)
                .email(email)
                .role(Role.ROLE_USER)
                .provider(provider)
                .build();
            return userRepository.save(newUser);
        });
        
        // Custom logic to generate token for OAuth user bypassing AuthenticationManager
        Authentication auth = new UsernamePasswordAuthenticationToken(
                com.phishguard.security.UserPrincipal.create(user), 
                null, 
                com.phishguard.security.UserPrincipal.create(user).getAuthorities()
        );
        String jwt = tokenProvider.generateToken(auth);
        return new JwtAuthenticationResponse(jwt, user.getId(), user.getName(), user.getEmail());
    }
}
