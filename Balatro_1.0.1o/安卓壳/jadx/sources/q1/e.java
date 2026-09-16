package q1;

import android.os.Parcel;
import android.os.Parcelable;
import c2.j0;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.common.data.DataHolder;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e extends c2.q implements f {
    public e() {
        super("com.google.android.gms.games.internal.IGamesCallbacks");
    }

    @Override // c2.q
    protected final boolean a(int i4, Parcel parcel, Parcel parcel2, int i5) {
        if (i4 == 6001) {
            parcel.readString();
            j0.e(parcel);
        } else if (i4 == 6002) {
            parcel.readString();
            j0.e(parcel);
        } else if (i4 == 12011) {
            DataHolder dataHolder = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
            j0.e(parcel);
            h0(dataHolder);
        } else if (i4 == 12012) {
            int readInt = parcel.readInt();
            String readString = parcel.readString();
            j0.e(parcel);
            A(readInt, readString);
        } else if (i4 == 13001) {
            j0.e(parcel);
        } else if (i4 == 13002) {
            parcel.readInt();
            j0.e(parcel);
        } else if (i4 == 19001) {
            parcel.readInt();
            j0.e(parcel);
        } else if (i4 != 19002) {
            switch (i4) {
                case 5001:
                    parcel.readInt();
                    parcel.readString();
                    j0.e(parcel);
                    break;
                case 5002:
                    DataHolder dataHolder2 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                    j0.e(parcel);
                    U(dataHolder2);
                    break;
                case 5003:
                    int readInt2 = parcel.readInt();
                    String readString2 = parcel.readString();
                    j0.e(parcel);
                    E(readInt2, readString2);
                    break;
                case 5004:
                    DataHolder dataHolder3 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                    j0.e(parcel);
                    F(dataHolder3);
                    break;
                case 5005:
                    Parcelable.Creator<DataHolder> creator = DataHolder.CREATOR;
                    DataHolder dataHolder4 = (DataHolder) j0.b(parcel, creator);
                    DataHolder dataHolder5 = (DataHolder) j0.b(parcel, creator);
                    j0.e(parcel);
                    k0(dataHolder4, dataHolder5);
                    break;
                case 5006:
                    DataHolder dataHolder6 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                    j0.e(parcel);
                    c0(dataHolder6);
                    break;
                case 5007:
                    DataHolder dataHolder7 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                    j0.e(parcel);
                    u(dataHolder7);
                    break;
                case 5008:
                    DataHolder dataHolder8 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                    j0.e(parcel);
                    D(dataHolder8);
                    break;
                case 5009:
                    j0.e(parcel);
                    break;
                case 5010:
                    j0.e(parcel);
                    break;
                case 5011:
                    j0.e(parcel);
                    break;
                default:
                    switch (i4) {
                        case 5016:
                            M();
                            break;
                        case 5017:
                            j0.e(parcel);
                            break;
                        case 5018:
                            j0.e(parcel);
                            break;
                        case 5019:
                            j0.e(parcel);
                            break;
                        case 5020:
                            parcel.readInt();
                            parcel.readString();
                            j0.e(parcel);
                            break;
                        case 5021:
                            j0.e(parcel);
                            break;
                        case 5022:
                            j0.e(parcel);
                            break;
                        case 5023:
                            j0.e(parcel);
                            break;
                        case 5024:
                            j0.e(parcel);
                            break;
                        case 5025:
                            j0.e(parcel);
                            break;
                        case 5026:
                            parcel.createStringArray();
                            j0.e(parcel);
                            break;
                        case 5027:
                            parcel.createStringArray();
                            j0.e(parcel);
                            break;
                        case 5028:
                            parcel.createStringArray();
                            j0.e(parcel);
                            break;
                        case 5029:
                            parcel.createStringArray();
                            j0.e(parcel);
                            break;
                        case 5030:
                            parcel.createStringArray();
                            j0.e(parcel);
                            break;
                        case 5031:
                            parcel.createStringArray();
                            j0.e(parcel);
                            break;
                        case 5032:
                            j0.e(parcel);
                            break;
                        case 5033:
                            parcel.readInt();
                            parcel.readInt();
                            parcel.readString();
                            j0.e(parcel);
                            break;
                        case 5034:
                            parcel.readInt();
                            parcel.readString();
                            j0.a(parcel);
                            j0.e(parcel);
                            break;
                        case 5035:
                            j0.e(parcel);
                            break;
                        case 5036:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 5037:
                            j0.e(parcel);
                            break;
                        case 5038:
                            j0.e(parcel);
                            break;
                        case 5039:
                            j0.e(parcel);
                            break;
                        case 5040:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 9001:
                            j0.e(parcel);
                            break;
                        case 11001:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 12001:
                            DataHolder dataHolder9 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                            j0.e(parcel);
                            b0(dataHolder9);
                            break;
                        case 14001:
                            j0.e(parcel);
                            break;
                        case 15001:
                            DataHolder dataHolder10 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                            j0.e(parcel);
                            m(dataHolder10);
                            break;
                        case 17002:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 19008:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 19009:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 19010:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 20001:
                            j0.e(parcel);
                            break;
                        case 20002:
                            j0.e(parcel);
                            break;
                        case 20003:
                            j0.e(parcel);
                            break;
                        case 20004:
                            j0.e(parcel);
                            break;
                        case 20005:
                            j0.e(parcel);
                            break;
                        case 20006:
                            j0.e(parcel);
                            break;
                        case 20007:
                            j0.e(parcel);
                            break;
                        case 20008:
                            j0.e(parcel);
                            break;
                        case 20009:
                            j0.e(parcel);
                            break;
                        case 20012:
                            j0.e(parcel);
                            break;
                        case 20019:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 20020:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 23001:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 23002:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 23003:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 23004:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 23005:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 24002:
                            j0.a(parcel);
                            j0.e(parcel);
                            break;
                        case 25002:
                            parcel.readString();
                            j0.e(parcel);
                            break;
                        case 25003:
                            Status status = (Status) j0.b(parcel, Status.CREATOR);
                            String readString3 = parcel.readString();
                            j0.e(parcel);
                            B(status, readString3);
                            break;
                        case 25004:
                            j0.e(parcel);
                            break;
                        case 25005:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 25006:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        case 25007:
                            Status status2 = (Status) j0.b(parcel, Status.CREATOR);
                            String readString4 = parcel.readString();
                            ArrayList<String> createStringArrayList = parcel.createStringArrayList();
                            j0.e(parcel);
                            R(status2, readString4, createStringArrayList);
                            break;
                        case 25008:
                            parcel.readInt();
                            j0.e(parcel);
                            break;
                        default:
                            switch (i4) {
                                case 8001:
                                    DataHolder dataHolder11 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                                    j0.e(parcel);
                                    J(dataHolder11);
                                    break;
                                case 8002:
                                    parcel.readInt();
                                    j0.e(parcel);
                                    break;
                                case 8003:
                                    j0.e(parcel);
                                    break;
                                case 8004:
                                    j0.e(parcel);
                                    break;
                                case 8005:
                                    j0.e(parcel);
                                    break;
                                case 8006:
                                    j0.e(parcel);
                                    break;
                                case 8007:
                                    parcel.readInt();
                                    parcel.readString();
                                    j0.e(parcel);
                                    break;
                                case 8008:
                                    j0.e(parcel);
                                    break;
                                case 8009:
                                    parcel.readString();
                                    j0.e(parcel);
                                    break;
                                case 8010:
                                    parcel.readString();
                                    j0.e(parcel);
                                    break;
                                default:
                                    switch (i4) {
                                        case 10001:
                                            j0.e(parcel);
                                            break;
                                        case 10002:
                                            parcel.readString();
                                            j0.e(parcel);
                                            break;
                                        case 10003:
                                            j0.e(parcel);
                                            break;
                                        case 10004:
                                            j0.e(parcel);
                                            break;
                                        case 10005:
                                            parcel.readInt();
                                            j0.e(parcel);
                                            break;
                                        case 10006:
                                            j0.e(parcel);
                                            break;
                                        default:
                                            switch (i4) {
                                                case 12004:
                                                    DataHolder dataHolder12 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                                                    n1.a aVar = (n1.a) j0.b(parcel, n1.a.CREATOR);
                                                    j0.e(parcel);
                                                    a0(dataHolder12, aVar);
                                                    break;
                                                case 12005:
                                                    DataHolder dataHolder13 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                                                    j0.e(parcel);
                                                    G(dataHolder13);
                                                    break;
                                                case 12006:
                                                    j0.e(parcel);
                                                    break;
                                                case 12007:
                                                    j0.e(parcel);
                                                    break;
                                                case 12008:
                                                    j0.e(parcel);
                                                    break;
                                                default:
                                                    switch (i4) {
                                                        case 12014:
                                                            j0.e(parcel);
                                                            break;
                                                        case 12015:
                                                            parcel.readInt();
                                                            j0.e(parcel);
                                                            break;
                                                        case 12016:
                                                            j0.e(parcel);
                                                            break;
                                                        case 12017:
                                                            DataHolder dataHolder14 = (DataHolder) j0.b(parcel, DataHolder.CREATOR);
                                                            String readString5 = parcel.readString();
                                                            Parcelable.Creator<n1.a> creator2 = n1.a.CREATOR;
                                                            n1.a aVar2 = (n1.a) j0.b(parcel, creator2);
                                                            n1.a aVar3 = (n1.a) j0.b(parcel, creator2);
                                                            n1.a aVar4 = (n1.a) j0.b(parcel, creator2);
                                                            j0.e(parcel);
                                                            H(dataHolder14, readString5, aVar2, aVar3, aVar4);
                                                            break;
                                                        default:
                                                            return false;
                                                    }
                                            }
                                    }
                            }
                    }
            }
        } else {
            parcel.readInt();
            j0.a(parcel);
            j0.e(parcel);
        }
        parcel2.writeNoException();
        return true;
    }
}
