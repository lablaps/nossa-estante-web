package br.com.treinaweb.twjobs.core.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import br.com.treinaweb.twjobs.core.models.Book;
import jakarta.persistence.EntityManager;

@Repository
public class BookCustomRepository {
        private final EntityManager em;

    public BookCustomRepository(EntityManager em) {
        this.em = em;
    }

    public List<Book> booksCustom(Long id, String gender){

          String query = "select A from Book as A";
          String condicao = " where ";

          if(id!=null){
               query += condicao + "A.id = :id";
               condicao = " and ";
          }

          if(gender!=null){
               query += condicao + "A.gender = :gender";
               condicao = " and ";
          }

// -----------------------------------------------------------------------------------

          var q = em.createQuery(query, Book.class);

          if(id!=null){
              q.setParameter("id", id);
          }

          if(gender!=null){
              q.setParameter("gender", gender);
          }

// -----------------------------------------------------------------------------------

          return q.getResultList();

     }
}
