import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/env.dart';

class ApiClient {
  ApiClient._internal();
  static final ApiClient instance = ApiClient._internal();

  final http.Client _client = http.Client();

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<Map<String, String>> _defaultHeaders({bool withAuth = true}) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (withAuth) {
      final token = await _getToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  Uri _buildUri(String path) {
    return Uri.parse('${Env.apiBaseUrl}$path');
  }

  Future<http.Response> post(
    String path, {
    Map<String, dynamic>? body,
    bool withAuth = true,
  }) async {
    final headers = await _defaultHeaders(withAuth: withAuth);
    final uri = _buildUri(path);
    return _client.post(
      uri,
      headers: headers,
      body: jsonEncode(body ?? {}),
    );
  }

  Future<http.Response> get(
    String path, {
    bool withAuth = true,
  }) async {
    final headers = await _defaultHeaders(withAuth: withAuth);
    final uri = _buildUri(path);
    return _client.get(uri, headers: headers);
  }

  Future<http.Response> patch(
    String path, {
    Map<String, dynamic>? body,
    bool withAuth = true,
  }) async {
    final headers = await _defaultHeaders(withAuth: withAuth);
    final uri = _buildUri(path);
    return _client.patch(
      uri,
      headers: headers,
      body: jsonEncode(body ?? {}),
    );
  }
}