package id.tu.service.domain.service.impl;

import id.tu.service.domain.dto.user.UserRequestCreateDTO;
import id.tu.service.domain.dto.user.UserRequestUpdateDTO;
import id.tu.service.domain.dto.user.UserResponseDTO;
import id.tu.service.domain.mapper.UserMapper;
import id.tu.service.domain.model.customer.Customer;
import id.tu.service.domain.model.user.Role;
import id.tu.service.domain.model.user.User;
import id.tu.service.domain.repository.CustomerRepository;
import id.tu.service.domain.repository.RoleRepository;
import id.tu.service.domain.repository.UserRepository;
import id.tu.service.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserResponseDTO createUser(UserRequestCreateDTO createDTO) {
        // Map DTO to entity
        User user = userMapper.toEntity(createDTO);

        // Hash the password
        String hashedPassword = passwordEncoder.encode(createDTO.getPassword());
        user.setPassword(hashedPassword);

        // Save the user
        User savedUser = userRepository.save(user);

        // Map saved entity to DTO and return
        return userMapper.toResponseDTO(savedUser);
    }

//    @Override
//    public UserResponseDTO updateUser(Long id, UserRequestUpdateDTO updateDTO) {
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        userMapper.updateEntityFromDTO(updateDTO, user);
//        User updatedUser = userRepository.save(user);
//        return userMapper.toResponseDTO(updatedUser);
//    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestUpdateDTO updateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Manually update fields from the DTO to the User entity
        if (updateDTO.getUsername() != null) {
            user.setUsername(updateDTO.getUsername());
        }
        if (updateDTO.getEmail() != null) {
            user.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updateDTO.getPassword())); // Encrypt the password
        }
        if (updateDTO.getStatus() != null) {
            user.setStatus(updateDTO.getStatus());
        }
        if (updateDTO.getRoleIds() != null && !updateDTO.getRoleIds().isEmpty()) {
            Set<Role> roles = roleRepository.findAllById(updateDTO.getRoleIds())
                    .stream()
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }
        if (updateDTO.getCustomerId() != null) {
            Customer customer = customerRepository.findById(updateDTO.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            user.setCustomer(customer);
        }

        // Save updated user entity
        User updatedUser = userRepository.save(user);

        // Convert to Response DTO
        return userMapper.toResponseDTO(updatedUser);
    }


    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toResponseDTO(user);
    }

    @Override
    public UserResponseDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toResponseDTO(user);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
}
