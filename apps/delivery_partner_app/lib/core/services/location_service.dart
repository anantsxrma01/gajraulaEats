import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class LocationService {
  static Future<bool> _ensurePermission() async {
    // First use permission_handler to check
    final status = await Permission.location.request();

    if (status.isGranted) {
      return true;
    } else if (status.isPermanentlyDenied) {
      // Ideally: open app settings
      await openAppSettings();
      return false;
    }
    return false;
  }

  static Future<Position?> getCurrentPosition() async {
    final hasPermission = await _ensurePermission();
    if (!hasPermission) return null;

    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // Optionally, request user to enable GPS
      return null;
    }

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }
}