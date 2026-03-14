"use client";

interface StudentRisk {
  id: string;
  name: string;
  avatar?: string;
  grade: string | number;
  completion: number;
  status: 'High' | 'Medium' | 'Low';
  prediction: string;
}

const students: StudentRisk[] = [
  { id: '1', name: 'James Wilson', grade: 'B-', completion: 65, status: 'High', prediction: 'At risk of failing' },
  { id: '2', name: 'Sarah Parker', grade: 'A', completion: 98, status: 'Low', prediction: 'Top performer' },
  { id: '3', name: 'Michael Chen', grade: 'B+', completion: 85, status: 'Low', prediction: 'Steady progress' },
  { id: '4', name: 'Emily Davis', grade: 'C+', completion: 72, status: 'Medium', prediction: 'Needs attention' },
];

export function StudentRiskTable() {
  return (
    <div className="bg-charcoal-blue-900 rounded-3xl border border-charcoal-blue-800 overflow-hidden shadow-xl">
      <div className="px-6 py-5 border-b border-charcoal-blue-800 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Student Risk Analysis</h3>
        <button className="text-sm font-semibold text-electric-sapphire-400 hover:text-electric-sapphire-300">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-charcoal-blue-400 bg-charcoal-blue-950/50">
              <th className="px-6 py-4 font-bold">Student</th>
              <th className="px-6 py-4 font-bold">Grade</th>
              <th className="px-6 py-4 font-bold">Completion</th>
              <th className="px-6 py-4 font-bold">Risk Level</th>
              <th className="px-6 py-4 font-bold">AI Prediction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-blue-800">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-charcoal-blue-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-charcoal-blue-800 flex items-center justify-center text-xs font-bold text-white">
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-white">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-charcoal-blue-300 font-medium">{student.grade}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 w-24 bg-charcoal-blue-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-electric-sapphire-500 rounded-full" 
                        style={{ width: `${student.completion}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-charcoal-blue-300">{student.completion}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                    student.status === 'High' ? 'bg-rose-500/10 text-rose-500' :
                    student.status === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs italic text-charcoal-blue-400">{student.prediction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
