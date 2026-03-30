import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

function VerifyEmail() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 p-4">
      <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <h1 className="text-4xl">📩</h1>
        </div>
      </div>
      <div className="space-y-3 max-w-md">
        <h1 className="text-3xl font-black tracking-tight">
          {t('verifyEmailTitle')}
        </h1>
        <p className="text-muted-foreground font-medium">
          {t('verifyEmailDesc1')} <span className="text-red-500 font-bold ">{t('verifyEmailDesc2')}</span> {t('verifyEmailDesc3')}
        </p>
      </div>
      <Button asChild size="lg" className="rounded-2xl font-bold px-8 mt-4">
        <Link to="/login">
          {t('goToLogin')}
        </Link>
      </Button>
    </div>
  );
}

export default VerifyEmail;