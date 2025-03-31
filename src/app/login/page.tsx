// pages/login.tsx
const microsoftLoginUrl = `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}/oauth2/v2.0/authorize?client_id=${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI}&response_mode=query&scope=openid profile email`;

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <a href={microsoftLoginUrl}>
        <button>Microsoft Login</button>
      </a>
    </div>
  );
}