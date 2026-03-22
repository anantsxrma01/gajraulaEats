class AppUser {
  final String id;
  final String phone;
  final String role;
  final String? name;

  AppUser({
    required this.id,
    required this.phone,
    required this.role,
    this.name,
  });

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: json['id']?.toString() ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? '',
      name: json['name'],
    );
  }
}
