import { useEffect } from 'react';
import { supabase } from '../libs/supabase';
import { useUserStore } from '../stores/userStore';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if we have a session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        navigate('/login');
        return;
      }

      if (session) {
        const user = session.user;

        if (
          user.app_metadata?.provider === 'google' && 
          user.user_metadata?.full_name && 
          !user.user_metadata?.nickname
        ) {
          const { data, error: updateError } = await supabase.auth.updateUser({
            data: { 
              nickname: user.user_metadata.full_name 
            }
          });

          if (updateError) {
            console.error('Error updating user nickname:', updateError);
          } else if (data) {
            const { error: dbUpdateError } = await supabase
              .from('users')
              .update({ nickname: user.user_metadata.full_name })
              .eq('id', user.id);

            if (dbUpdateError) {
              console.error('Error updating nickname in database:', dbUpdateError);
            } else {
              console.log('Updated nickname in database:', user.user_metadata.full_name);
            }

            setUser(data.user);
            console.log('Updated user nickname from Google profile:', data.user.user_metadata.nickname);
            navigate('/');
            return;
          }
        }

        setUser(user);

        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title">인증 처리 중...</h2>
          <p>잠시만 기다려주세요.</p>
          <div className="flex justify-center mt-4">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthCallback;
