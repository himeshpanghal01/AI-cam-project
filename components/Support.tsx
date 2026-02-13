import React, { useState } from "react";
import { ChevronDown, Mail, MessageSquare, BookOpen, AlertCircle, Send, Activity, ShieldCheck } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const Support: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"contact" | "faq" | "troubleshoot">("faq");

    const faqItems: FAQItem[] = [
        {
            question: "What file formats are supported?",
            answer: "We support MP4, WebM, AVI video formats and JPG, PNG image formats. For best results, ensure your files are below 200MB for web demo purposes.",
        },
        {
            question: "How do I set up my Gemini API key?",
            answer: "You need a valid Google Gemini API key to use this application. Configure it in your environment variables or application settings. The key enables video analysis functionality.",
        },
        {
            question: "What is the maximum file size?",
            answer: "The web demo supports files up to 200MB. For larger CCTV files or production use, consider using smaller segments or dedicated infrastructure.",
        },
        {
            question: "How accurate is the crowd detection?",
            answer: "Accuracy depends on video quality, lighting, and camera angle. The AI model provides best results in clear, well-lit environments. For critical applications, verify automated results manually.",
        },
        {
            question: "Can I use this for real-time analysis?",
            answer: "The current version is designed for batch/file-based analysis. For real-time streaming, you would need a different architecture with dedicated backend infrastructure.",
        },
        {
            question: "What data is sent to Google Gemini?",
            answer: "Only your uploaded video/image (in base64 format) and analysis prompts are sent to the API. No personal data is stored unless you configure additional logging.",
        },
    ];

    const troubleshootItems = [
        { title: "Analysis is failing", icon: Activity, tips: ["Verify API key is correct", "Check API key hasn't expired", "Ensure model is gemini-2.0-flash-exp", "Check account quota"] },
        { title: "Video won't upload", icon: ShieldCheck, tips: ["Check file format (MP4, WebM, AVI)", "Verify file size is under 200MB", "Ensure file is not corrupted", "Try clearing browser cache"] },
        { title: "Chat is not responding", icon: MessageSquare, tips: ["Verify API key validity", "Check internet connectivity", "Ensure video has been analyzed first", "Try refreshing the page"] },
        { title: "Video preview not showing", icon: AlertCircle, tips: ["Try a different file format", "Upload a different video", "Check browser compatibility", "Ensure browser supports HTML5 video"] },
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess("Your message has been sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        }, 1500);
    };

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    return (
        /* FIX APPLIED HERE: 
           Changed 'min-h-screen' to 'h-screen overflow-y-auto'. 
           This ensures the component scrolls internally even if the parent body/div is fixed height.
        */
        <div className="relative h-screen w-full overflow-y-auto bg-[#0a0a0a] text-slate-300 font-sans selection:bg-indigo-500/30 scroll-smooth">
            
            {/* Background Ambient Glow (Fixed position so it stays while scrolling) */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto py-16 px-4 sm:px-6 pb-24">
                
                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white tracking-tight">
                        Support Center
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl">
                        Find answers, troubleshoot issues, or get in touch with our AI team.
                    </p>
                </div>

                {/* Quick Help Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
                    {[
                        { icon: Mail, title: "Email Support", desc: "support@aicctv.com", color: "text-blue-400", border: "border-t-blue-500" },
                        { icon: MessageSquare, title: "Live Chat", desc: "Available 9AM-6PM UTC", color: "text-emerald-400", border: "border-t-emerald-500" },
                        { icon: BookOpen, title: "Documentation", desc: "View Implementation Guides", color: "text-purple-400", border: "border-t-purple-500" }
                    ].map((card, i) => (
                        <div key={i} className={`group bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-800/60 transition-all duration-300 border-t-4 ${card.border} shadow-lg shadow-black/20`}>
                            <card.icon className={`w-8 h-8 ${card.color} mb-3 group-hover:scale-110 transition-transform duration-300`} />
                            <h3 className="text-white font-semibold text-lg mb-1">{card.title}</h3>
                            <p className="text-sm text-slate-400">{card.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-10">
                    <div className="bg-gray-900/80 p-1.5 rounded-2xl border border-gray-800 inline-flex shadow-xl shadow-black/40 backdrop-blur-md sticky top-4 z-20">
                        {(["faq", "troubleshoot", "contact"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    activeTab === tab
                                        ? "bg-slate-800 text-white shadow-md shadow-black/20 ring-1 ring-white/10"
                                        : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                                } capitalize`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {/* FAQ Tab */}
                    {activeTab === "faq" && (
                        <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {faqItems.map((item, index) => (
                                <div
                                    key={index}
                                    className={`bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 ${expandedFAQ === index ? 'ring-1 ring-blue-500/30 bg-gray-800/40' : 'hover:border-gray-700'}`}
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full p-5 flex items-center justify-between text-left group"
                                    >
                                        <h3 className={`font-medium text-lg transition-colors ${expandedFAQ === index ? "text-blue-400" : "text-slate-200 group-hover:text-white"}`}>
                                            {item.question}
                                        </h3>
                                        <ChevronDown
                                            className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                                                expandedFAQ === index ? "rotate-180 text-blue-400" : "group-hover:text-slate-300"
                                            }`}
                                        />
                                    </button>
                                    <div 
                                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${expandedFAQ === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-5 pb-5 pt-0 text-slate-400 leading-relaxed border-t border-dashed border-gray-800/50 mt-2">
                                                <br/>
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Troubleshooting Tab */}
                    {activeTab === "troubleshoot" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {troubleshootItems.map((item, index) => (
                                <div key={index} className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 hover:bg-gray-800/40 hover:border-gray-700 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                                            <item.icon className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {item.tips.map((tip, tipIndex) => (
                                            <li key={tipIndex} className="text-sm text-slate-400 flex items-start gap-2.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 group-hover:bg-indigo-500 transition-colors" />
                                                <span className="flex-1">{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === "contact" && (
                        <div className="max-w-2xl mx-auto bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold mb-6 text-white">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                                        placeholder="Describe your issue regarding the CCTV analysis..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </span>
                                    ) : (
                                        <>
                                            Send Message <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {success && (
                                    <div className={`p-4 rounded-xl text-center text-sm font-medium border ${
                                        success.includes("successfully") 
                                            ? "bg-emerald-900/20 border-emerald-900/50 text-emerald-400" 
                                            : "bg-red-900/20 border-red-900/50 text-red-400"
                                    }`}>
                                        {success}
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Support;