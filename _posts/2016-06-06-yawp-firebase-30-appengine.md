---
layout: blog
title: YAWP! + Firebase 3.0 + GAE
---

Since I've started mixing YAWP! APIs with some of the new Google Firebase 3.0 features,
specially for my mobile apps, I've faced some challenges, mostly because the Firebase + 
Google Cloud integration is pretty new in the market.

<!--more-->

One of the really awesome Firebase's features is its authentication model, which helps linking
different user's social accounts together, leveraging the Google 
Identity Toolkit with easy to use SDKs for Java, Javascript, Android and iOS.

This is the authentication flow I'm talking about:

1. User access the app, either Web, Android or IOS;
2. Firebase SDK redirects to the sign-in provider: Google, Facebook, etc;
3. User authorizes the app at the provider OAuth page;
4. User is redirected to Firebase identity endpoint;
5. Firebase links the user account and generates a JWT access token (returned to app);
6. User access YAWP! endpoints using the JWT token;
7. YAWP! APIs verifies if the JWT token is valid and legit;

### The Problem

To execute the step 7, one could easily use the Firebase Java SDK, as 
described in this [guide](https://firebase.google.com/docs/auth/server#verify_id_tokens), like this:

~~~ java
String idToken;  // Get the user's ID token from the client app

FirebaseAuth.getInstance().verifyIdToken(idToken)
    .addOnSuccessListener(new OnSuccessListener<FirebaseToken>() {
        @Override
        public void onSuccess(FirebaseToken decodedToken) {
          String uid = decodedToken.getUid();
          // ...
        }
});
~~~

The problem is that if you try to do this on Appengine, you will get the following error:

~~~ java
java.lang.IllegalStateException: This feature is only available to backend instances.
~~~

Saying that the SDK can't be used inside the regular fronted instances because
it uses some __java.util.concurrent__ features that are only supported by the backend 
environment.

### The Solution

One solution could be deploy your YAWP! API as backend API, but this will create other kind
of problems, different pricing, scalability, etc.

So, to solve the problem, one should verify the token manually. To do so, I've got the details 
of the Firebase JWT architecture from 
[this answer](http://stackoverflow.com/questions/37408684/is-it-still-possible-to-do-server-side-verification-of-tokens-in-firebase-3/37492640#37492640) at the
Stackoverflow.

The main idea is to verify the Firebase JWT by checking it against one of the
Google Cloud's pubic certificates. To deal with the low-level details of the JWT architecture
we are going to be using the [JJWT Library](https://github.com/jwtk/jjwt).

The following class has a __verifyIdToken(token)__ method that assembles together all the details
described at the previous links:

~~~ java
public class AppengineFirebaseAuth {

    private static final String APP_ID = "baggrapp";

    public static AppengineFirebaseToken verifyIdToken(String token) {
        Map<String, String> publicKeys = GooglePublicKeys.getKeys();

        for (String kid : publicKeys.keySet()) {
            String publicKey = publicKeys.get(kid);

            try {
                Jws<Claims> claimsJws = verifyIdTokey(token, kid, publicKey);
                return new AppengineFirebaseToken(claimsJws.getBody());
            } catch (SignatureException e) {
                continue; // try next key
            } catch (ExpiredJwtException e) {
                throw new InvalidFirebaseTokenException(e.getMessage());
            }
        }

        throw new InvalidFirebaseTokenException("No Google public keys for JWT Token");
    }

    private static Jws<Claims> verifyIdTokey(String token, String kid, String publicKey) {
        PublicKey pk = createPk(publicKey);
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(pk).parseClaimsJws(token);
        validate(claimsJws, kid);
        return claimsJws;
    }

    private static void validate(Jws<Claims> claimsJws, String kid) {
        if (claimsJws.getHeader().getAlgorithm().equals("RS256") &&
                claimsJws.getBody().getAudience().equals(APP_ID) &&
                claimsJws.getBody().getIssuer().equals("https://securetoken.google.com/" + APP_ID) &&
                claimsJws.getBody().getSubject() != null &&
                claimsJws.getHeader().getKeyId().equals(kid)) {
            return;
        }
        throw new InvalidFirebaseTokenException("Invalid Firebase Id Token");
    }

    private static PublicKey createPk(String publicKey) {
        try {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            InputStream stream = new ByteArrayInputStream(publicKey.getBytes("UTF-8"));
            java.security.cert.Certificate cert = cf.generateCertificate(stream);
            return cert.getPublicKey();
        } catch (CertificateException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
~~~

Finally, the Google Cloud public certificates need to be fetched from time to time, since
they are always changing to minimize security isssues. The following class will deal
with this:

~~~ java
public class GooglePublicKeys {

    private static final String GOOGLE_PUBLIC_KEYS = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

    private static final int ONE_DAY = 1000 * 60 * 60 * 24;

    private static GooglePublicKeys instance;

    private long timestamp;

    private Map<String, String> keys;

    private GooglePublicKeys() {
    }

    public static Map<String, String> getKeys() {
        if (instance == null || isOutdated()) {
            reload();
        }

        return instance.keys;
    }

    private static boolean isOutdated() {
        return instance.timestamp < System.currentTimeMillis() - ONE_DAY;
    }

    private synchronized static void reload() {
        if (instance != null && !isOutdated()) {
            return;
        }

        instance = new GooglePublicKeys();
        instance.keys = fetchGooglePublicKeys();
        instance.timestamp = System.currentTimeMillis();
    }

    private static Map<String, String> fetchGooglePublicKeys() {
        return parseJson(fetchKeysJson());
    }

    private static String fetchKeysJson() {
        try {
            URLFetchService urlFetch = URLFetchServiceFactory.getURLFetchService();

            HTTPResponse response = urlFetch.fetch(new URL(GOOGLE_PUBLIC_KEYS));
            return new String(response.getContent());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static Map<String, String> parseJson(String json) {
        Gson gson = new Gson();
        Map<String, String> map = new HashMap<>();
        return gson.fromJson(json, map.getClass());
    }

}
~~~

That's it.

