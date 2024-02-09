import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

const Auth = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    //const { error } = await supabase.auth.signInWithOtp({ email });
    const error = false;

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('Check your email for the login link!');
    }
    setLoading(false);
  }

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Welcome to TIL Helper</h1>
        <p className="description">Sign in with your github email address below</p>
        <div>
          <button className={'button block'} disabled={loading} onClick={handleLogin}>
            {loading ? <span>Loading</span> : <span>Sign in With Github</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth;