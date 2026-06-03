package br.com.treinaweb.twjobs.core.models;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded=true)
@EqualsAndHashCode(onlyExplicitlyIncluded=true)
public class Exchange {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Include
    @ManyToOne
    private Book book;

    @ToString.Include
    @ManyToOne
    private Book book_a;

    @ToString.Include
    @ManyToOne
    private Book book_b;

    @ToString.Include
    @ManyToOne
    private User from_user;

    @ToString.Include
    @ManyToOne
    private User to_user;

    // O usuário "a" verifica se aceita o livro que o "b" quer em troca 
    // @ColumnDefault("0")
    @Column(columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean status_a = false;
    
    // O usuário "b" verifica se aceita ou não o livro do usuário "a" -> por que as vezes "b" não quer dar o livro
    // @ColumnDefault("0")
    @Column(columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean status_b = false;
    
    // Quando "a" e "b" são 1, aqui é 1. Se diferente disso é 0
    // @ColumnDefault("0")
    @Column(columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean status_total = false;




}
