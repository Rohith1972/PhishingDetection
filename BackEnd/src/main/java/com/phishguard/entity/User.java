package com.phishguard.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    private String email;

    private String name;

    private String password;

    private Role role;

    private AuthProvider provider;

    private String providerId;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
