import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PostJob() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        salary: '',
        type: 'Full-Time',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:5000/api/jobs', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Job posted successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error('Failed to post job. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create a Listing</h1>
                    <p className="text-slate-500 font-semibold mt-2">Find the perfect candidate for your team.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                    
                    {/* SECTION 1: BASIC INFO */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <h2 className="text-xl font-black text-slate-900">Basic Information</h2>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                            <input 
                                name="title" required onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 transition-all font-medium"
                                placeholder="e.g. Senior Product Designer"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                                <input 
                                    name="location" required onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 transition-all font-medium"
                                    placeholder="e.g. Remote, NY, or London"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Job Type</label>
                                <select 
                                    name="type" onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 transition-all font-bold text-slate-600"
                                >
                                    <option>Full-Time</option>
                                    <option>Part-Time</option>
                                    <option>Contract</option>
                                    <option>Freelance</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* SECTION 2: DETAILS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <h2 className="text-xl font-black text-slate-900">Job Details</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Salary Range (Optional)</label>
                            <input 
                                name="salary" onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 transition-all font-medium"
                                placeholder="e.g. $100k - $140k"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea 
                                name="description" required onChange={handleChange} rows="6"
                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-600 transition-all font-medium"
                                placeholder="Describe the role, requirements, and benefits..."
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className={`w-full bg-purple-600 text-white py-5 rounded-2xl font-black transition-all shadow-xl shadow-purple-100 active:scale-95 flex justify-center items-center gap-3 ${loading ? 'opacity-70' : 'hover:bg-black'}`}
                    >
                        {loading ? 'Publishing...' : 'Publish Job Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
}