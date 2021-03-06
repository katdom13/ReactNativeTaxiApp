# ReactNativeTaxiApp

## Encountered Problems and Fixes

### 1. Installing @mauron85/react-native-background-geolocation
#### A. The android app is not building because of dependency to the module:
##### Reference: https://github.com/mauron85/react-native-background-geolocation/issues/468
##### Solution: 
  1. Add the library with `yarn add @mauron85/react-native-background-geolocation`
  2. Launch the script using `node ./node_modules/@mauron85/react-native-background-geolocation/scripts/postlink.js`
  3. Check setup for android.
    a. In `android/settings.gradle`
    
    
        ```
        ...
        include ':@mauron85_react-native-background-geolocation-common'
        project(':@mauron85_react-native-background-geolocation-common').projectDir = new File(rootProject.projectDir, '../node_modules/@mauron85/react-native-background-geolocation/android/common')
        include ':@mauron85_react-native-background-geolocation'
        project(':@mauron85_react-native-background-geolocation').projectDir = new File(rootProject.projectDir, '../node_modules/@mauron85/react-native-background-geolocation/android/lib')
        ...
        ```

        b. In `android/app/build.gradle`

        ```
        dependencies {
            ...
            implementation project(':@mauron85_react-native-background-geolocation')
            ...
        }
        ```


  4. Intall patch-package
  `yarn add patch-package postinstall-postinstall`
  
  5. Edit files in `node_modules/@mauron85/react-native-background-geolocation`
  
        ```
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/VERSIONS.gradle b/node_modules/@mauron85/react-native-background-geolocation/android/common/VERSIONS.gradle
        index 61f0865..17a0623 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/VERSIONS.gradle
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/VERSIONS.gradle
        @@ -21,11 +21,11 @@ def RESOURCE_PREFIX = "mauron85_bgloc_"
         ext {
             getApplicationId = { ->
                 def applicationId = "com.marianhello.app"
        -        if (findProject('..:app') != null) {
        -            applicationId = project('..:app').android.defaultConfig.applicationId
        -        } else if (findProject(':app') != null) {
        -            applicationId = project(':app').android.defaultConfig.applicationId
        -        }
        +        // if (findProject('..:app') != null) {
        +        //     applicationId = project('..:app').android.defaultConfig.applicationId
        +        // } else if (findProject(':app') != null) {
        +        //     applicationId = project(':app').android.defaultConfig.applicationId
        +        // }
                 if (rootProject.hasProperty('applicationId')) {
                     applicationId = rootProject.applicationId
                 }
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/build.gradle b/node_modules/@mauron85/react-native-background-geolocation/android/common/build.gradle
        index 98542b1..07961e8 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/build.gradle
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/build.gradle
        @@ -64,7 +64,7 @@ android {
                 resValue "string", resourcePrefix + "account_name", 'Locations'
                 resValue "string", resourcePrefix + "account_type", accountPrefix + '.account'
                 resValue "string", resourcePrefix + "content_authority", accountPrefix + '.provider'
        -        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
        +        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
                 minSdkVersion project.ext.getMinSdkVersion()
                 versionCode 1
                 versionName "1.0"
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/BackgroundGeolocationFacadeTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/BackgroundGeolocationFacadeTest.java
        index 24fc246..3de1756 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/BackgroundGeolocationFacadeTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/BackgroundGeolocationFacadeTest.java
        @@ -1,7 +1,7 @@
         package com.marianhello.bgloc;

        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.runner.AndroidJUnit4;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;

         import com.marianhello.bgloc.data.BackgroundLocation;
         import com.marianhello.bgloc.provider.TestLocationProviderFactory;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/BatchManagerTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/BatchManagerTest.java
        index 33e5c69..cd1439d 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/BatchManagerTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/BatchManagerTest.java
        @@ -2,9 +2,9 @@ package com.marianhello.bgloc;

         import android.content.Context;
         import android.database.sqlite.SQLiteDatabase;
        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.runner.AndroidJUnit4;
        -import android.support.test.filters.SmallTest;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;
        +import androidx.test.filters.SmallTest;
         import android.util.JsonReader;
         import android.util.JsonToken;

        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/ContentProviderLocationDAOTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/ContentProviderLocationDAOTest.java
        index a255b87..e7aaec7 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/ContentProviderLocationDAOTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/ContentProviderLocationDAOTest.java
        @@ -16,7 +16,7 @@ import java.util.ArrayList;
         import java.util.Collection;
         import java.util.Iterator;

        -import static android.support.test.InstrumentationRegistry.getContext;
        +import static androidx.test.platform.app.InstrumentationRegistry.getContext;
         import static com.marianhello.bgloc.data.sqlite.SQLiteLocationContract.LocationEntry.SQL_DROP_LOCATION_TABLE;
         import static junit.framework.Assert.assertEquals;

        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/DBLogReaderTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/DBLogReaderTest.java
        index 27c27c9..026a547 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/DBLogReaderTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/DBLogReaderTest.java
        @@ -1,9 +1,9 @@
         package com.marianhello.bgloc;

         import android.content.Context;
        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.runner.AndroidJUnit4;
        -import android.support.test.filters.SmallTest;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;
        +import androidx.test.filters.SmallTest;

         import com.marianhello.logging.DBLogReader;
         import com.marianhello.logging.LogEntry;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/LocationServiceProxyTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/LocationServiceProxyTest.java
        index 01c5271..ceaad33 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/LocationServiceProxyTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/LocationServiceProxyTest.java
        @@ -6,20 +6,17 @@ import android.content.Intent;
         import android.content.IntentFilter;
         import android.os.Bundle;
         import android.os.IBinder;
        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.rule.ServiceTestRule;
        -import android.support.test.runner.AndroidJUnit4;
        -import android.support.v4.content.LocalBroadcastManager;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.rule.ServiceTestRule;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;
        +import androidx.localbroadcastmanager.content.LocalBroadcastManager;

         import com.marianhello.bgloc.provider.TestLocationProviderFactory;
         import com.marianhello.bgloc.service.LocationServiceImpl;
        -import com.marianhello.bgloc.service.LocationServiceIntentBuilder;
         import com.marianhello.bgloc.service.LocationServiceProxy;

         import org.junit.After;
        -import org.junit.AfterClass;
         import org.junit.Before;
        -import org.junit.BeforeClass;
         import org.junit.Ignore;
         import org.junit.Rule;
         import org.junit.Test;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/LocationServiceTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/LocationServiceTest.java
        index 6698819..dee5233 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/LocationServiceTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/LocationServiceTest.java
        @@ -7,12 +7,12 @@ import android.content.IntentFilter;
         import android.location.Location;
         import android.os.Bundle;
         import android.os.IBinder;
        -import android.support.annotation.NonNull;
        -import android.support.annotation.Nullable;
        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.rule.ServiceTestRule;
        -import android.support.test.runner.AndroidJUnit4;
        -import android.support.v4.content.LocalBroadcastManager;
        +import androidx.annotation.NonNull;
        +import androidx.annotation.Nullable;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.rule.ServiceTestRule;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;
        +import androidx.localbroadcastmanager.content.LocalBroadcastManager;

         import com.marianhello.bgloc.data.BackgroundLocation;
         import com.marianhello.bgloc.provider.MockLocationProvider;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteConfigurationDAOTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteConfigurationDAOTest.java
        index 2257931..d5b3bb6 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteConfigurationDAOTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteConfigurationDAOTest.java
        @@ -3,11 +3,10 @@ package com.marianhello.bgloc;
         import android.content.Context;
         import android.database.Cursor;
         import android.database.sqlite.SQLiteDatabase;
        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.runner.AndroidJUnit4;
        -import android.support.test.filters.SmallTest;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;
        +import androidx.test.filters.SmallTest;

        -import com.marianhello.bgloc.Config;
         import com.marianhello.bgloc.data.HashMapLocationTemplate;
         import com.marianhello.bgloc.data.LocationTemplate;
         import com.marianhello.bgloc.data.LocationTemplateFactory;
        @@ -24,7 +23,6 @@ import org.junit.runner.RunWith;

         import java.util.ArrayList;
         import java.util.HashMap;
        -import java.util.LinkedHashSet;

         /**
          * Created by finch on 13/07/16.
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteLocationDAOTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteLocationDAOTest.java
        index 3c8ff11..92bb501 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteLocationDAOTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteLocationDAOTest.java
        @@ -3,9 +3,9 @@ package com.marianhello.bgloc;
         import android.content.Context;
         import android.database.sqlite.SQLiteDatabase;
         import android.location.Location;
        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.runner.AndroidJUnit4;
        -import android.support.test.filters.SmallTest;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;
        +import androidx.test.filters.SmallTest;

         import com.marianhello.bgloc.data.BackgroundLocation;
         import com.marianhello.bgloc.data.sqlite.SQLiteLocationDAO;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteLocationDAOThreadTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteLocationDAOThreadTest.java
        index 32b9b7b..eccc276 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteLocationDAOThreadTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteLocationDAOThreadTest.java
        @@ -3,9 +3,9 @@ package com.marianhello.bgloc;
         import android.content.Context;
         import android.database.sqlite.SQLiteDatabase;
         import android.location.Location;
        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.runner.AndroidJUnit4;
        -import android.support.test.filters.SmallTest;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;
        +import androidx.test.filters.SmallTest;

         import com.marianhello.bgloc.data.BackgroundLocation;
         import com.marianhello.bgloc.data.sqlite.SQLiteLocationDAO;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteOpenHelperTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteOpenHelperTest.java
        index 169c6c4..d5efa03 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteOpenHelperTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/androidTest/java/com/marianhello/bgloc/SQLiteOpenHelperTest.java
        @@ -5,9 +5,9 @@ import android.content.Context;
         import android.database.Cursor;
         import android.database.sqlite.SQLiteDatabase;
         import android.location.Location;
        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.runner.AndroidJUnit4;
        -import android.support.test.filters.SmallTest;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;
        +import androidx.test.filters.SmallTest;

         import com.marianhello.bgloc.data.BackgroundLocation;
         import com.marianhello.bgloc.data.sqlite.SQLiteConfigurationContract;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/BackgroundGeolocationFacade.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/BackgroundGeolocationFacade.java
        index a8c755f..e428e3a 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/BackgroundGeolocationFacade.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/BackgroundGeolocationFacade.java
        @@ -14,8 +14,8 @@ import android.os.Build;
         import android.os.Bundle;
         import android.provider.Settings;
         import android.provider.Settings.SettingNotFoundException;
        -import android.support.v4.content.ContextCompat;
        -import android.support.v4.content.LocalBroadcastManager;
        +import androidx.core.content.ContextCompat;
        +import androidx.localbroadcastmanager.content.LocalBroadcastManager;
         import android.text.TextUtils;

         import com.github.jparkie.promise.Promise;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/Config.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/Config.java
        index db809d0..09a6432 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/Config.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/Config.java
        @@ -12,7 +12,7 @@ package com.marianhello.bgloc;
         import android.os.Bundle;
         import android.os.Parcel;
         import android.os.Parcelable;
        -import android.support.annotation.Nullable;
        +import androidx.annotation.Nullable;

         import com.marianhello.bgloc.data.AbstractLocationTemplate;
         import com.marianhello.bgloc.data.LocationTemplate;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/data/BackgroundLocation.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/data/BackgroundLocation.java
        index f41b12a..9d2e7ce 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/data/BackgroundLocation.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/data/BackgroundLocation.java
        @@ -7,9 +7,8 @@ import android.os.Build;
         import android.os.Bundle;
         import android.os.Parcel;
         import android.os.Parcelable;
        -import android.support.v4.util.TimeUtils;
        +import androidx.core.util.TimeUtils;

        -import com.marianhello.bgloc.data.sqlite.SQLiteLocationContract;
         import com.marianhello.bgloc.data.sqlite.SQLiteLocationContract.LocationEntry;

         import org.json.JSONException;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/data/LocationTransform.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/data/LocationTransform.java
        index 3e3b65c..41e2002 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/data/LocationTransform.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/data/LocationTransform.java
        @@ -1,10 +1,8 @@
         package com.marianhello.bgloc.data;

         import android.content.Context;
        -import android.support.annotation.NonNull;
        -import android.support.annotation.Nullable;
        -
        -import com.marianhello.bgloc.data.BackgroundLocation;
        +import androidx.annotation.NonNull;
        +import androidx.annotation.Nullable;

         public interface LocationTransform
         {
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/service/LocationServiceImpl.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/service/LocationServiceImpl.java
        index 18f1ba1..8f40b37 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/service/LocationServiceImpl.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/service/LocationServiceImpl.java
        @@ -29,8 +29,8 @@ import android.os.IBinder;
         import android.os.Looper;
         import android.os.Message;
         import android.os.Process;
        -import android.support.annotation.Nullable;
        -import android.support.v4.content.LocalBroadcastManager;
        +import androidx.annotation.Nullable;
        +import androidx.localbroadcastmanager.content.LocalBroadcastManager;

         import com.marianhello.bgloc.Config;
         import com.marianhello.bgloc.ConnectivityListener;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/service/LocationServiceIntentBuilder.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/service/LocationServiceIntentBuilder.java
        index fd0b99e..3d95eba 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/service/LocationServiceIntentBuilder.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/service/LocationServiceIntentBuilder.java
        @@ -21,7 +21,7 @@ import android.content.Context;
         import android.content.Intent;
         import android.os.Bundle;
         import android.os.Parcelable;
        -import android.support.annotation.IntDef;
        +import androidx.annotation.IntDef;

         import java.lang.annotation.Retention;
         import java.lang.annotation.RetentionPolicy;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/sync/NotificationHelper.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/sync/NotificationHelper.java
        index 9be9687..0959766 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/sync/NotificationHelper.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/sync/NotificationHelper.java
        @@ -9,8 +9,8 @@ import android.content.Intent;
         import android.graphics.BitmapFactory;
         import android.graphics.Color;
         import android.os.Build;
        -import android.support.annotation.RequiresApi;
        -import android.support.v4.app.NotificationCompat;
        +import androidx.annotation.RequiresApi;
        +import androidx.core.app.NotificationCompat;

         import com.marianhello.bgloc.ResourceResolver;
         import com.marianhello.logging.LoggerManager;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/sync/SyncAdapter.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/sync/SyncAdapter.java
        index 9c713e9..c2fe392 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/sync/SyncAdapter.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/main/java/com/marianhello/bgloc/sync/SyncAdapter.java
        @@ -11,8 +11,8 @@ import android.content.SyncResult;
         import android.os.Bundle;
         import android.os.Handler;
         import android.os.Looper;
        -import android.support.v4.app.NotificationCompat;
        -import android.support.v4.content.LocalBroadcastManager;
        +import androidx.core.app.NotificationCompat;
        +import androidx.localbroadcastmanager.content.LocalBroadcastManager;

         import com.marianhello.bgloc.Config;
         import com.marianhello.bgloc.HttpPostService;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/BackgroundLocationTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/BackgroundLocationTest.java
        index 145816a..35ffe15 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/BackgroundLocationTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/BackgroundLocationTest.java
        @@ -1,7 +1,7 @@
         package com.marianhello.backgroundgeolocation;

         import android.os.Build;
        -import android.support.test.filters.SmallTest;
        +import androidx.test.filters.SmallTest;

         import com.marianhello.bgloc.data.BackgroundLocation;

        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/ConfigTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/ConfigTest.java
        index 01ee7f9..80ab3d8 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/ConfigTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/ConfigTest.java
        @@ -1,6 +1,6 @@
         package com.marianhello.backgroundgeolocation;

        -import android.support.test.filters.SmallTest;
        +import androidx.test.filters.SmallTest;

         import com.marianhello.bgloc.Config;
         import com.marianhello.bgloc.data.ArrayListLocationTemplate;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/DBLogReaderTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/DBLogReaderTest.java
        index 39e3d3e..6072a6f 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/DBLogReaderTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/common/src/test/java/com/marianhello/backgroundgeolocation/DBLogReaderTest.java
        @@ -1,6 +1,6 @@
         package com.marianhello.backgroundgeolocation;

        -import android.support.test.filters.SmallTest;
        +import androidx.test.filters.SmallTest;

         import com.marianhello.logging.DBLogReader;

        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/gradle.properties b/node_modules/@mauron85/react-native-background-geolocation/android/gradle.properties
        index 89e0d99..915f0e6 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/gradle.properties
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/gradle.properties
        @@ -16,3 +16,5 @@
         # This option should only be used with decoupled projects. More details, visit
         # http://www.gradle.org/docs/current/userguide/multi_project_builds.html#sec:decoupled_projects
         # org.gradle.parallel=true
        +android.enableJetifier=true
        +android.useAndroidX=true
        \ No newline at end of file
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/lib/build.gradle b/node_modules/@mauron85/react-native-background-geolocation/android/lib/build.gradle
        index 3a8b36c..32c46bc 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/lib/build.gradle
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/lib/build.gradle
        @@ -69,7 +69,7 @@ android {
             useLibrary 'android.test.mock'

             defaultConfig {
        -        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
        +        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
                 minSdkVersion project.ext.getMinSdkVersion()
                 targetSdkVersion project.ext.getTargetSdkVersion()
                 versionCode 1 // intentionally not updating version as we're not uploading to any java repository
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/lib/src/androidTest/java/com/marianhello/bgloc/react/ConfigMapperTest.java b/node_modules/@mauron85/react-native-background-geolocation/android/lib/src/androidTest/java/com/marianhello/bgloc/react/ConfigMapperTest.java
        index 44682bc..48b1676 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/lib/src/androidTest/java/com/marianhello/bgloc/react/ConfigMapperTest.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/lib/src/androidTest/java/com/marianhello/bgloc/react/ConfigMapperTest.java
        @@ -1,9 +1,9 @@
         package com.marianhello.bgloc.react;

         import android.content.Context;
        -import android.support.test.InstrumentationRegistry;
        -import android.support.test.runner.AndroidJUnit4;
        -import android.support.test.filters.SmallTest;
        +import androidx.test.platform.app.InstrumentationRegistry;
        +import androidx.test.ext.junit.runners.AndroidJUnit4;
        +import androidx.test.filters.SmallTest;

         import com.facebook.react.bridge.Arguments;
         import com.facebook.react.bridge.ReadableMap;
        diff --git a/node_modules/@mauron85/react-native-background-geolocation/android/lib/src/main/java/com/marianhello/bgloc/react/headless/HeadlessService.java b/node_modules/@mauron85/react-native-background-geolocation/android/lib/src/main/java/com/marianhello/bgloc/react/headless/HeadlessService.java
        index 50a31b4..298f6fb 100644
        --- a/node_modules/@mauron85/react-native-background-geolocation/android/lib/src/main/java/com/marianhello/bgloc/react/headless/HeadlessService.java
        +++ b/node_modules/@mauron85/react-native-background-geolocation/android/lib/src/main/java/com/marianhello/bgloc/react/headless/HeadlessService.java
        @@ -2,7 +2,7 @@ package com.marianhello.bgloc.react.headless;

         import android.content.Intent;
         import android.os.Bundle;
        -import android.support.annotation.Nullable;
        +import androidx.annotation.Nullable;

         import com.facebook.react.HeadlessJsTaskService;
         import com.facebook.react.bridge.Arguments;
        ```
      
  6. Make package for @mauron85/react-native-background-geolocation
  `yarn patch-package @mauron85/react-native-background-geolocation`
  
  7. Apply patches
  `yarn patch-package`
  
  8. Rebuild android project in android studio
  
  
### 2. Using BackgroundGeolocation
#### A. Reading of background location stops after a while

##### Reference: https://github.com/mauron85/react-native-background-geolocation/issues/523
##### Solution: 

  1. In your app's manifest file (`AndroidManifest.xml`), make sure you have the following:
        ```
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION " />
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
        <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION " />
        ```
  2. In the dependency manifest file, `node_modules/@mauron85/react-native-background-geolocation/android/lib/src/main/AndroidManifest.xml`, make sure you have the following:

        `<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION " />`


  3. Rebuild android project in android studio
