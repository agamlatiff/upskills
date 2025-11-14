import React from 'react';

export const CodeEditor: React.FC = () => {
    const code = `
class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function saveOrder(StoreOrderRequest $request)
    {
        $validated = $request->validated();
        // ... business logic
        return redirect()->route('front.index');
    }
}
    `;
    return (
      <div className="bg-[#282c34] rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
        <div className="flex items-center p-3 border-b border-slate-700">
            <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <p className="text-sm text-slate-400 ml-4">OrderController.php</p>
        </div>
        <div className="p-4">
            <pre className="text-sm text-white overflow-x-auto">
                <code className="font-mono">{code.trim()}</code>
            </pre>
        </div>
      </div>
    );
};
