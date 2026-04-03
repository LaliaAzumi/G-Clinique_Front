import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Stethoscope } from "lucide-react";
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
      {/* overlay sombre */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      {/* Glass login card */}
      <div className="glass-card w-full max-w-md px-8 py-10 sm:px-10">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-center text-2xl font-bold text-primary-foreground">
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

          {/* Forgot password */}
          <div className="text-right">
            <a href="#" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Forgot Password?
            </a>
          </div>

          {/* Sign In button */}
          <button type="submit" className="login-btn">
            SIGN IN
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-primary-foreground/20" />
            <span className="text-xs text-primary-foreground/50">or</span>
            <div className="h-px flex-1 bg-primary-foreground/20" />
          </div>

          {/* Google */}
          <button type="button" className="google-btn">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-primary-foreground/60">
          Don't have an account?{" "}
          <a href="#" className="font-semibold text-primary-foreground hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
