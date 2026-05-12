package br.com.treinaweb.twjobs.core.converters;

import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "[]";
        }

        try {
            return OBJECT_MAPPER.writeValueAsString(attribute);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Nao foi possivel serializar a lista de contribuintes.", exception);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return OBJECT_MAPPER.readValue(dbData, new TypeReference<List<String>>() {});
        } catch (Exception exception) {
            throw new IllegalArgumentException("Nao foi possivel desserializar a lista de contribuintes.", exception);
        }
    }
}
