export default function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
    />
  );
}