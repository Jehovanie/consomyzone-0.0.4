<?php
namespace App\Service;

use Firebase\JWT\JWT;

class JWTService{

    // Use the following function to generate your JaaS JWT.

    public function create_jaas_token(
        $api_key,
        $app_id,
        $user_email,
        $user_name,
        $user_is_moderator,
        $user_avatar_url,
        $user_id,
        $live_streaming_enabled,
        $recording_enabled,
        $outbound_enabled,
        $transcription_enabled,
        $exp_delay,
        $nbf_delay,
        $private_key) {

        $payload = array(
            'iss' => 'chat',
            'aud' => 'jitsi',
            'exp' => time() + $exp_delay,
            'nbf' => time() - $nbf_delay,
            'room'=> '*',
            'sub' => $app_id,
            'context' => [
                'user' => [
                    'moderator' => $user_is_moderator ? "true" : "false",
                    'email' => $user_email,
                    'name' => $user_name,
                    'avatar' => $user_avatar_url,
                    'id' => $user_id
                ],
                'features' => [
                    'recording' => $recording_enabled ? "true" : "false",
                    'livestreaming' => $live_streaming_enabled ? "true" : "false",
                    'transcription' => $transcription_enabled ? "true" : "false",
                    'outbound-call' => $outbound_enabled ? "true" : "false"
                ]
            ]
        );
        return JWT::encode($payload, $private_key, "RS256", $api_key);
        }

}
