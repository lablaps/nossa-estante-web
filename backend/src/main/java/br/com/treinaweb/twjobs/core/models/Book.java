package br.com.treinaweb.twjobs.core.models;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import br.com.treinaweb.twjobs.core.converters.StringListConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@Table(name = "books")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Book {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Include
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = true, length = 255)
    private String title;

    @Column(nullable = true, length = 255)
    private String author;

    @Column(nullable = true, length = 500)
    private String coverURL;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String synopses;

    @Column(nullable = true)
    private Integer pageCount;

    @Column(nullable = true, length = 150)
    private String publisher;

    @Column(nullable = true, length = 60)
    private String publishedDate;

    @Column(nullable = true, length = 60)
    private String isbn10;

    @Column(nullable = true, length = 60)
    private String isbn13;

    @Column(nullable = true, length = 60)
    private String language;

    @Column(nullable = true, length = 60)
    private String edition;

    @Column(nullable = true, length = 60)
    private String publishPlace;

    @Column(nullable = true, length = 45)
    private String physicalFormat;

    @Column(nullable = true, length = 45)
    private String material_state;

    @Column(nullable = true, length = 45)
    private String status;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT", nullable = true)
    private List<String> contributors;

    @ColumnDefault("0.00")
    @Column(nullable = true, precision = 10, scale = 2)
    private BigDecimal cost;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = true)
    private Date data;

    @Column(nullable = true, length = 255)
    private String gender;
}
