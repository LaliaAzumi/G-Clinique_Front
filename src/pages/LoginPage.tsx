import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Stethoscope, Link } from "lucide-react";
import loginBg from "@/assets/login-bg.jpg";
import { useAuth } from "@/context/AuthContext"; // notre context global
import { loginRequest } from "@/services/api"; // service API centralisé

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // accès au context pour stocker token + user
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ⚡ Appel API backend
      const data = await loginRequest(username, password);

      // 🔐 Stockage global de l'utilisateur et du token
      login(data);

      // 🔄 Redirection vers dashboard
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.message || "Erreur de connexion");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Glass login card */}
      <div className="glass-card w-full max-w-md px-8 py-10 sm:px-10">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm">
            <Stethoscope className="h-7 w-7 text-primary-foreground text-[#0a2f29]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-center text-2xl font-bold text-primary-foreground text-[#0a2f29]">
          Welcome Back!
        </h1>
        <p className="mb-8 text-center text-sm text-primary-foreground/70">
          Name user
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/50" />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input pl-11"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground/50" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input pl-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Sign In button */}
          <button type="submit" className="login-btn">
            SIGN IN
          </button>

         
        </form>

        {/* Sign up link */}
        {/* Sign up link */}
        <p className="mt-8 text-center text-sm text-primary-foreground/60 text-[#0a2f29]">
          Don't have an account?{" "}
          <Link 
            to="/register" 
            className="font-semibold text-primary-foreground hover:underline transition-all text-[#0a2f29]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
