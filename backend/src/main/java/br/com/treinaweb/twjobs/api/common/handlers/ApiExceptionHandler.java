package br.com.treinaweb.twjobs.api.common.handlers;

import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import br.com.treinaweb.twjobs.api.common.dtos.ErrorResponse;
import br.com.treinaweb.twjobs.api.common.dtos.ValidationErrorResponse;
import br.com.treinaweb.twjobs.core.exceptions.JwtServiceException;
import br.com.treinaweb.twjobs.core.exceptions.ModelNotFoundException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ModelNotFoundException.class)
    @ResponseStatus(code = HttpStatus.NOT_FOUND)
    public ErrorResponse handleModelNotFoundException(
        ModelNotFoundException exception
    ) {
        return ErrorResponse.builder()
            .message(exception.getLocalizedMessage())
            .build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public ValidationErrorResponse handleMethodArgumentNotValidException(
        MethodArgumentNotValidException exception
    ) {
        var errors = exception.getBindingResult().getFieldErrors()
            .stream()
            .collect(Collectors.groupingBy(
                fieldError -> fieldError.getField(),
                Collectors.mapping(
                    fieldError -> fieldError.getDefaultMessage(),
                    Collectors.toList()
                )
            ));
        return ValidationErrorResponse.builder()
            .message("Validation error")
            .errors(errors)
            .build();
    }

    @ExceptionHandler(JwtServiceException.class)
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleJwtServiceException(JwtServiceException e) {
        return ErrorResponse.builder()
            .message(e.getLocalizedMessage())
            .build();
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleInsufficientAuthenticationException(
        InsufficientAuthenticationException exception
    ) {
        return ErrorResponse.builder()
            .message("Usuario nao autenticado.")
            .build();
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(code = HttpStatus.CONFLICT)
    public ErrorResponse handleDataIntegrityViolationException(
        DataIntegrityViolationException exception
    ) {
        return ErrorResponse.builder()
            .message("Nao foi possivel salvar os dados informados.")
            .build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgumentException(
        IllegalArgumentException exception
    ) {
        return ErrorResponse.builder()
            .message(exception.getLocalizedMessage())
            .build();
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(
        ResponseStatusException exception
    ) {
        var statusCode = HttpStatus.valueOf(exception.getStatusCode().value());
        return ResponseEntity.status(statusCode)
            .body(ErrorResponse.builder()
                .message(exception.getReason() == null ? statusCode.getReasonPhrase() : exception.getReason())
                .build());
    }
}
