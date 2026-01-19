package com.expense.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

	private final SecretKey secretKey;
	private final long expiration;

	public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long expiration) {
		// 🔐 Convert string to secure key (HS256 requires 256-bit key)
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
		this.expiration = expiration;
	}

	// 🔹 Generate JWT Token
	public String generateToken(String username) {

		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expiration))
				.signWith(secretKey, SignatureAlgorithm.HS256).compact();
	}

	// 🔹 Extract username
	public String extractUsername(String token) {
		return getClaims(token).getSubject();
	}

	// 🔹 Validate token
	public boolean validateToken(String token) {
		try {
			getClaims(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	// 🔹 Internal method
	private Claims getClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
	}
}
