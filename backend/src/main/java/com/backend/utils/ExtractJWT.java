package com.backend.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {
    public static String payloadJWTExtraction(String token, String extraction) {
        token.replace("Bearer ", "");

        String[] parts = token.split("\\.")
                ;
        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(parts[1]));

        String[] entries = payload.split(",");
        Map<String, String> mp = new HashMap<String, String>();

        for (String entry: entries) {
            String[] keyVal = entry.split(":");
            if (keyVal[0].equals(extraction)) {
                int remove = 1;

                if (keyVal[1].endsWith("}")) {
                    remove = 2;
                }

                keyVal[1] = keyVal[1].substring(0, keyVal[1].length() - remove);
                keyVal[1] = keyVal[1].substring(1);

                mp.put(keyVal[0], keyVal[1]);
            }
        }

        return mp.getOrDefault(extraction, null);
    }
}
