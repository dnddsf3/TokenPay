package id.tu.service.domain.service;


import id.tu.service.domain.dto.user.UserRequestCreateDTO;
import id.tu.service.domain.dto.user.UserRequestUpdateDTO;
import id.tu.service.domain.dto.user.UserResponseDTO;

import java.util.List;

public interface UserService {

    // Create a new user
    UserResponseDTO createUser(UserRequestCreateDTO createDTO);

    // Update an existing user
    UserResponseDTO updateUser(Long id, UserRequestUpdateDTO updateDTO);

    // Get user by ID
    UserResponseDTO getUserById(Long id);

    // Get user by username
    UserResponseDTO getUserByUsername(String username);

    // Get all users
    List<UserResponseDTO> getAllUsers();

    // Delete a user by ID
    void deleteUserById(Long id);
}
