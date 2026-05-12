//package br.com.treinaweb.twjobs.core.models;
//
//
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.util.List;
//
//@Data
//@Entity
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//@ToString(onlyExplicitlyIncluded=true)
//@EqualsAndHashCode(onlyExplicitlyIncluded = true)
//public class Volume {
//
//    @Id
//    @EqualsAndHashCode.Include
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ToString.Include
//    @ManyToOne
//    private User user;
//
//    private String name;
//
//    @Column
//    private String pub_date;
//
//    @Column(length=200)
//    private String synopsis;
//
//    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//    @JoinTable(
//            name="book_genre",
//            joinColumns = @JoinColumn(name="book_id"),
//            inverseJoinColumns = @JoinColumn(name="genre_id")
//    )
//    @JsonIgnoreProperties("book")
//    private List<Genre> genres;
//
//    private String author;
//
//    private Boolean isForTrade;
//
//    private String condition;
//
//    @Column(length=100)
//    private String imageUrls;
//
//    @OneToMany(cascade = CascadeType.ALL)
//    private List<Comment> comments;
//
//    private String desiredTradeBooks;
//}
