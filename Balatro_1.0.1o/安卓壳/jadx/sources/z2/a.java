package z2;

import a1.b2.c3;
import b3.f;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {
    public static final Class a(f3.a aVar) {
        f.e(aVar, "<this>");
        Class a4 = ((b3.a) aVar).a();
        f.c(a4, "null cannot be cast to non-null type java.lang.Class<T of kotlin.jvm.JvmClassMappingKt.<get-java>>");
        return a4;
    }

    public static final Class b(f3.a aVar) {
        f.e(aVar, "<this>");
        Class a4 = ((b3.a) aVar).a();
        if (!a4.isPrimitive()) {
            f.c(a4, "null cannot be cast to non-null type java.lang.Class<T of kotlin.jvm.JvmClassMappingKt.<get-javaObjectType>>");
            return a4;
        }
        String name = a4.getName();
        switch (name.hashCode()) {
            case -1325958191:
                if (name.equals("double")) {
                    a4 = Double.class;
                    break;
                }
                break;
            case 104431:
                if (name.equals("int")) {
                    a4 = Integer.class;
                    break;
                }
                break;
            case 3039496:
                if (name.equals("byte")) {
                    a4 = Byte.class;
                    break;
                }
                break;
            case 3052374:
                if (name.equals("char")) {
                    a4 = Character.class;
                    break;
                }
                break;
            case 3327612:
                if (name.equals(c3.d4(181))) {
                    a4 = Long.class;
                    break;
                }
                break;
            case 3625364:
                if (name.equals("void")) {
                    a4 = Void.class;
                    break;
                }
                break;
            case 64711720:
                if (name.equals("boolean")) {
                    a4 = Boolean.class;
                    break;
                }
                break;
            case 97526364:
                if (name.equals("float")) {
                    a4 = Float.class;
                    break;
                }
                break;
            case 109413500:
                if (name.equals("short")) {
                    a4 = Short.class;
                    break;
                }
                break;
        }
        f.c(a4, "null cannot be cast to non-null type java.lang.Class<T of kotlin.jvm.JvmClassMappingKt.<get-javaObjectType>>");
        return a4;
    }
}
