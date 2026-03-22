import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/network/api_client.dart';
import 'user_model.dart';
import '../../partner/data/delivery_partner_model.dart';

class AuthRepository {
  final ApiClient _api = ApiClient.instance;

  Future<void> sendOtp(String phone) async {
    final res = await _api.post('/api/auth/send-otp', body: {'phone': phone}, withAuth: false);

    if (res.statusCode != 200) {
      throw Exception('Failed to send OTP');
    }
  }

  Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    final res = await _api.post(
      '/api/auth/verify-otp',
      body: {'phone': phone, 'otp': otp},
      withAuth: false,
    );

    if (res.statusCode != 200) {
      throw Exception('Invalid OTP or server error');
    }

    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final token = data['token'] as String?;
    final userJson = data['user'] as Map<String, dynamic>?;

    if (token == null || userJson == null) {
      throw Exception('Invalid response from server');
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);

    final user = AppUser.fromJson(userJson);
    return {
      'user': user,
      'token': token,
    };
  }

  Future<DeliveryPartnerModel> registerDeliveryPartner(String vehicleType) async {
    final res = await _api.post(
      '/api/delivery-partner/register',
      body: {
        'vehicle_type': vehicleType,
      },
    );

    if (res.statusCode != 201 && res.statusCode != 200) {
      throw Exception('Failed to register as delivery partner');
    }

    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final partnerJson = data['partner'] as Map<String, dynamic>;
    return DeliveryPartnerModel.fromJson(partnerJson);
  }

  Future<DeliveryPartnerModel?> fetchMyDeliveryPartnerProfile() async {
    final res = await _api.get('/api/delivery-partner/me');

    if (res.statusCode == 404) {
      return null;
    }

    if (res.statusCode != 200) {
      throw Exception('Failed to fetch partner profile');
    }

    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final partnerJson = data['partner'] as Map<String, dynamic>;
    return DeliveryPartnerModel.fromJson(partnerJson);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }
}
