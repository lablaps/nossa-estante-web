package br.com.treinaweb.twjobs.core.permissions;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.security.access.prepost.PreAuthorize;

public @interface TWJobsPermissions {

    // ORIGINAL FORMAT
    // @Target(ElementType.METHOD)
    // @Retention(RetentionPolicy.RUNTIME)
    // @PreAuthorize("""
    //     hasAuthority('COMPANY') and 
    //     @securityService.isOwner(principal.username, #id)
    // """)
    // public @interface IsOwner {}

    // MY FORMAT
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("""
        (hasAuthority('ADMIN') or hasAuthority('COMPANY')) and 
        @securityService.isOwner(principal.username, #id)
    """)
    public @interface IsOwner {}
    
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('ADMIN')")
    public @interface IsAdmin {}

    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('REGULAR')")
    public @interface IsRegular {}
    
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('COMPANY')")
    public @interface IsCompany {}
    
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('CANDIDATE')")
    public @interface IsCandidate {}

    
}
