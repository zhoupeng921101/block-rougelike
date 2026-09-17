package r0;

import a1.b2.c3;
import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.content.Context;
import android.os.PersistableBundle;
import android.util.Base64;
import com.google.android.datatransport.runtime.scheduling.jobscheduling.JobInfoSchedulerService;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.zip.Adler32;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class d implements x {

    /* renamed from: a, reason: collision with root package name */
    private final Context f4762a;

    /* renamed from: b, reason: collision with root package name */
    private final s0.d f4763b;

    /* renamed from: c, reason: collision with root package name */
    private final f f4764c;

    public d(Context context, s0.d dVar, f fVar) {
        this.f4762a = context;
        this.f4763b = dVar;
        this.f4764c = fVar;
    }

    private boolean d(JobScheduler jobScheduler, int i4, int i5) {
        Iterator<JobInfo> it = jobScheduler.getAllPendingJobs().iterator();
        while (true) {
            if (!it.hasNext()) {
                break;
            }
            JobInfo next = it.next();
            int i6 = next.getExtras().getInt("attemptNumber");
            if (next.getId() == i4) {
                if (i6 >= i5) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override // r0.x
    public void a(k0.o oVar, int i4, boolean z3) {
        ComponentName componentName = new ComponentName(this.f4762a, (Class<?>) JobInfoSchedulerService.class);
        JobScheduler jobScheduler = (JobScheduler) this.f4762a.getSystemService(c3.d4(496));
        int c4 = c(oVar);
        if (!z3 && d(jobScheduler, c4, i4)) {
            o0.a.b("JobInfoScheduler", "Upload for context %s is already scheduled. Returning...", oVar);
            return;
        }
        long O = this.f4763b.O(oVar);
        JobInfo.Builder c5 = this.f4764c.c(new JobInfo.Builder(c4, componentName), oVar.d(), O, i4);
        PersistableBundle persistableBundle = new PersistableBundle();
        persistableBundle.putInt("attemptNumber", i4);
        persistableBundle.putString("backendName", oVar.b());
        persistableBundle.putInt("priority", v0.a.a(oVar.d()));
        if (oVar.c() != null) {
            persistableBundle.putString(c3.d4(311), Base64.encodeToString(oVar.c(), 0));
        }
        c5.setExtras(persistableBundle);
        o0.a.c("JobInfoScheduler", "Scheduling upload for context %s with jobId=%d in %dms(Backend next call timestamp %d). Attempt %d", oVar, Integer.valueOf(c4), Long.valueOf(this.f4764c.g(oVar.d(), O, i4)), Long.valueOf(O), Integer.valueOf(i4));
        jobScheduler.schedule(c5.build());
    }

    @Override // r0.x
    public void b(k0.o oVar, int i4) {
        a(oVar, i4, false);
    }

    int c(k0.o oVar) {
        Adler32 adler32 = new Adler32();
        adler32.update(this.f4762a.getPackageName().getBytes(Charset.forName("UTF-8")));
        adler32.update(oVar.b().getBytes(Charset.forName("UTF-8")));
        adler32.update(ByteBuffer.allocate(4).putInt(v0.a.a(oVar.d())).array());
        if (oVar.c() != null) {
            adler32.update(oVar.c());
        }
        return (int) adler32.getValue();
    }
}
