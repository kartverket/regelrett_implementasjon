export function StylingTest() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="bg-blue-500 text-white p-2 rounded">Blue Box</div>
        <div className="bg-red-500 text-white p-2 rounded">Red Box</div>
        <div className="flex-box ">TEST</div>
      </div>
      <div className="flex gap-4 bg- ">
        <div className="bg-green-500 text-white p-2 rounded">Green Box</div>
        <div className="bg-yellow-500 text-white p-2 rounded">Yellow Box</div>
      </div>
    </div>
  );
}
