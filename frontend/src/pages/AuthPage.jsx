import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Camera } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      alert('Please Select an Image!');
      setLoading(false);
      return;
    }
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app'); // Standard tutorial preset, may need replacement
      data.append('cloud_name', 'piyush'); // Placeholder
      fetch('https://api.cloudinary.com/v1_1/piyush/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.url) setPic(data.url);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      alert('Please Select an Image!');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const config = { headers: { 'Content-type': 'application/json' } };
      const ENDPOINT = import.meta.env.VITE_API_URL || '';
      let res;
      if (isLogin) {
        res = await axios.post(`${ENDPOINT}/api/user/login`, { email, password }, config);
      } else {
        res = await axios.post(`${ENDPOINT}/api/user/register`, { name, email, password, pic }, config);
      }
      setUser(res.data);
      navigate('/chats');
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-24 font-sans text-white px-6">
      <div className="mb-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-[#02c754] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(2,199,84,0.3)]">
          <MessageCircle size={36} className="text-black" fill="black" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp Clone</h1>
        <p className="text-[#8e8e93] mt-2 text-[15px]">End-to-end encrypted messaging</p>
      </div>

      <div className="w-full max-w-sm bg-[#1c1c1e] p-6 rounded-2xl border border-[#2c2c2e]">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <div className="flex justify-center mb-2">
                <label className="w-20 h-20 rounded-full bg-[#2c2c2e] flex items-center justify-center cursor-pointer overflow-hidden border border-[#3c3c3e]">
                  {pic ? (
                    <img src={pic} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <Camera size={24} className="text-[#8e8e93]" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => postDetails(e.target.files[0])} />
                </label>
              </div>

              <input
                type="text"
                placeholder="Enter your name"
                className="bg-[#2c2c2e] border border-[#3c3c3e] rounded-xl px-4 py-3 text-white outline-none focus:border-[#02c754] transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Enter your email"
            className="bg-[#2c2c2e] border border-[#3c3c3e] rounded-xl px-4 py-3 text-white outline-none focus:border-[#02c754] transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Enter your password"
            className="bg-[#2c2c2e] border border-[#3c3c3e] rounded-xl px-4 py-3 text-white outline-none focus:border-[#02c754] transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            className="mt-4 bg-[#02c754] text-black font-bold text-[17px] py-3 rounded-xl hover:bg-[#00a884] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-[#8e8e93] text-[15px]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#02c754] font-semibold hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
