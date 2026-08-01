package com.phishguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(exclude = {RedisRepositoriesAutoConfiguration.class})
@EnableMongoRepositories(basePackages = "com.phishguard.repository")
public class PhishGuardApplication {

    public static void main(String[] args) {
        SpringApplication.run(PhishGuardApplication.class, args);
    }

}

