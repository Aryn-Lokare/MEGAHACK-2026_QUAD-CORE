"use client";

interface StudentPrediction {
  id: string;
  name: string;
  stats: {
    averageGrade: number;
    completionRate: number;
  };
  prediction: {
    riskLevel: string;
    predictedGrade: string;
    recommendation: string | null;
  } | null;
}

interface StudentPredictionTableProps {
  students: StudentPrediction[];
}

export function StudentPredictionTable({ students }: StudentPredictionTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-transparent">
        <div>
          <h3 className="text-lg font-bold text-black tracking-tight">Student Prediction Table</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-80">AI Risk Assessment Breakdown</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-slate-50 text-slate-900 text-xs font-extrabold uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200">
          Run Analysis
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
              <th className="px-8 py-5 font-bold">Student</th>
              <th className="px-8 py-5 font-bold">Average Grade</th>
              <th className="px-8 py-5 font-bold">Completion Rate</th>
              <th className="px-8 py-5 font-bold">Risk Level</th>
              <th className="px-8 py-5 font-bold">Predicted Grade</th>
              <th className="px-8 py-5 font-bold">Pedagogical Advice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-medium">No students found.</td>
              </tr>
            ) : students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-electric-sapphire-500/10 flex items-center justify-center text-xs font-bold text-electric-sapphire-600 group-hover:bg-electric-sapphire-500 group-hover:text-white transition-all">
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{student.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-slate-600 font-bold">
                    {student.stats?.averageGrade || 'N/A'}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-electric-sapphire-500 rounded-full" 
                        style={{ width: `${student.stats?.completionRate || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500">{student.stats?.completionRate || 0}%</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-widest ${
                    student.prediction?.riskLevel === 'High' ? 'bg-rose-500/10 text-rose-600 border border-rose-200' :
                    student.prediction?.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-600 border border-amber-200' :
                    'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
                  }`}>
                    {student.prediction?.riskLevel || 'Low'}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-extrabold text-electric-sapphire-600">
                    {student.prediction?.predictedGrade || '-'}
                </td>
                <td className="px-8 py-5 max-w-xs">
                  {student.prediction?.recommendation ? (
                    <div className="flex items-start gap-2 group/tip relative">
                      <div className="mt-0.5 p-1 rounded bg-amber-50 text-amber-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed group-hover/tip:text-slate-900 transition-colors">
                        {student.prediction.recommendation}
                      </p>
                    </div>
                  ) : (
                    <span className="text-slate-300 text-[10px] italic">Not yet analyzed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
