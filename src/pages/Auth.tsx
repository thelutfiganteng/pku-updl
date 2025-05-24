import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogIn, UserPlus, Mail, Lock } from "lucide-react";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
  }, [navigate]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      // Redirect to dashboard after successful login/register
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Auth failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-modern-yellow/20 via-white to-modern-blue/20 flex flex-col items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-modern-blue/10 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
        <div className="text-center mb-8 transform transition-all duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-modern-yellow to-modern-yellow-accent rounded-full mb-4 shadow-lg transform transition-transform duration-300 hover:rotate-12">
            <User className="text-modern-blue-dark" size={28} />
          </div>
          <h2 className="text-3xl font-bold text-modern-blue-dark mb-2">
            {mode === "login" ? "Welcome Back" : "Join InventoryHub"}
          </h2>
          <p className="text-modern-blue/70">
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleAuth}>
          <div className="transform transition-all duration-200 focus-within:scale-105">
            <label className="block text-sm font-semibold text-modern-blue-dark mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              className="w-full border-2 border-modern-blue/20 rounded-xl p-3 text-modern-blue-dark placeholder-modern-blue/50 focus:border-modern-yellow focus:ring-2 focus:ring-modern-yellow/20 transition-all duration-200 bg-white/80"
              placeholder="Enter your email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="transform transition-all duration-200 focus-within:scale-105">
            <label className="block text-sm font-semibold text-modern-blue-dark mb-2 flex items-center gap-2">
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              className="w-full border-2 border-modern-blue/20 rounded-xl p-3 text-modern-blue-dark placeholder-modern-blue/50 focus:border-modern-yellow focus:ring-2 focus:ring-modern-yellow/20 transition-all duration-200 bg-white/80"
              placeholder="Enter your password"
              value={password}
              required
              minLength={6}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 animate-fade-in">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-modern-yellow to-modern-yellow-accent text-modern-blue-dark hover:from-modern-yellow-accent hover:to-modern-yellow font-bold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105ayette
            hover:shadow-xl disabled:hover:scale-100"
            disabled={submitting}
          >
            <div className="flex items-center justify-center gap-2">
              {mode === "login" ? <LogIn size={20} /> : <UserPlus size={20} />}
              {submitting ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            </div>
          </Button>
        </form>

        <div className="text-center mt-6 transform transition-all duration-200">
          {mode === "login" ? (
            <p className="text-modern-blue/70">
              Don't have an account?{" "}
              <button
                className="text-modern-blue-dark font-semibold hover:text-modern-yellow transition-colors duration-200 hover:underline"
                onClick={() => setMode("register")}
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p className="text-modern-blue/70">
              Already have an account?{" "}
              <button
                className="text-modern-blue-dark font-semibold hover:text-modern-yellow transition-colors duration-200 hover:underline"
                onClick={() => setMode("login")}
              >
                Sign in here
              </button>
            </p>
          )}
          {/* New "Kembali ke Beranda" button */}
          <Button
            variant="link"
            className="mt-4 text-modern-blue-dark font-semibold hover:text-modern-yellow transition-colors duration-200 hover:underline"
            onClick={() => navigate("/")} // Adjust the route as needed (e.g., "/home" or "/")
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;