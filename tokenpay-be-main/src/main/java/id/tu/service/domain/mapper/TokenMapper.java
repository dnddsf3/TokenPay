package id.tu.service.domain.mapper;


import id.tu.service.domain.dto.token.TokenRequestCreateDTO;
import id.tu.service.domain.dto.token.TokenRequestUpdateDTO;
import id.tu.service.domain.dto.token.TokenResponseDTO;
import id.tu.service.domain.dto.token.TokenResponseSimpleDTO;
import id.tu.service.domain.model.token.Token;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TokenMapper {

    @Mapping(source = "gencoId", target = "genco.id")
    Token toEntity(TokenRequestCreateDTO createDTO);

    @Mapping(source = "gencoId", target = "genco.id")
    void updateEntity(@MappingTarget Token token, TokenRequestUpdateDTO updateDTO);

    @Mapping(source = "genco", target = "genco")
    TokenResponseDTO toResponseDTO(Token token);

    TokenResponseSimpleDTO toSimpleResponseDTO(Token token);
}
