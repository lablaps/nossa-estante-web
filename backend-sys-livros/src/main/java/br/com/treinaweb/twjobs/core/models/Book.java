package br.com.treinaweb.twjobs.core.models;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.ManyToOne;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.EqualsAndHashCode;
// import lombok.NoArgsConstructor;
// import lombok.ToString;


import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded=true)
@EqualsAndHashCode(onlyExplicitlyIncluded=true)
public class Book {
    
    
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ToString.Include
    @ManyToOne
    private User user;

    @Column(nullable=true, length = 255)
    private String title;

    @Column(nullable=true, length = 255)
    private String author;

    @Column(nullable=true, length = 500)
    private String coverURL;
    
    @Column(columnDefinition = "TEXT", nullable=true)
    private String synopses;

    // @Column(nullable=false,length = 60)
    // private int pageCount = 0;

    @Column(nullable=true, length = 150)
    private String publisher;

    @Column(nullable=true, length = 60)
    private String publishedDate;

    @Column(nullable=true, length = 60)
    private String isbn10;

    @Column(nullable=true, length = 60)
    private String isbn13;

    @Column(nullable=true, length = 60)
    private String language;

    @Column(nullable=true, length = 60)
    private String edition;

    @Column(nullable=true, length = 60)
    private String publishPlace;

    @Column (nullable = true, length = 45)
    private String physicalFormat;

    @Column (nullable = true, length = 45)
    private String material_state;

    @Column(nullable=true, length = 45)
    private String status;

    // @Convert(converter = ContributorsConverter.class)
    // @Column(nullable=true, length = 1000)
    private List<String> contributors;

    // Test if in SQL will work on
    @ColumnDefault("0.00")
    @Column(nullable=true, scale = 2)
    private BigDecimal cost;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable=true)
    private Date data;

    @Column(nullable=true, length = 255)
    private String gender;
    // path
    
}
