import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import shape1 from '../assets/images/shape1.svg'
import darkShape from '../assets/images/dark_shape.svg'
import shape2 from '../assets/images/shape2.svg'
import darkShape1 from '../assets/images/dark_shape1.svg'
import shape3 from '../assets/images/shape3.svg'
import darkShape2 from '../assets/images/dark_shape2.svg'
import registrationImg from '../assets/images/registration.png'
import registration1Img from '../assets/images/registration1.png'
import logo from '../assets/images/logo.svg'
import googleIcon from '../assets/images/google.svg'

export default function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    if (form.password !== form.repeatPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="_social_registration_wrapper _layout_main_wrapper">
        <div className="_shape_one">
          <img src={shape1} alt="" className="_shape_img" />
          <img src={darkShape} alt="" className="_dark_shape" />
        </div>
        <div className="_shape_two">
          <img src={shape2} alt="" className="_shape_img" />
          <img src={darkShape1} alt="" className="_dark_shape _dark_shape_opacity" />
        </div>
        <div className="_shape_three">
          <img src={shape3} alt="" className="_shape_img" />
          <img src={darkShape2} alt="" className="_dark_shape _dark_shape_opacity" />
        </div>
        <div className="_social_registration_wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <div className="_social_registration_right">
                  <div className="_social_registration_right_image">
                    <img src={registrationImg} alt="Image" />
                  </div>
                  <div className="_social_registration_right_image_dark">
                    <img src={registration1Img} alt="Image" />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div className="_social_registration_content">
                  <div className="_social_registration_right_logo _mar_b28">
                    <img src={logo} alt="Image" className="_right_logo" />
                  </div>
                  <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                  <h4 className="_social_registration_content_title _titl4 _mar_b50">
                    Registration
                  </h4>
                  <button type="button" className="_social_registration_content_btn _mar_b40">
                    <img src={googleIcon} alt="Image" className="_google_img" />{" "}
                    <span>Register with google</span>
                  </button>
                  <div className="_social_registration_content_bottom_txt _mar_b40">
                    {" "}<span>Or</span>
                  </div>

                  {error && (
                    <div style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>
                      {error}
                    </div>
                  )}

                  <form className="_social_registration_form" onSubmit={(e) => e.preventDefault()}>
                    <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                          <label className="_social_registration_label _mar_b8">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className="form-control _social_registration_input"
                          />
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                          <label className="_social_registration_label _mar_b8">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className="form-control _social_registration_input"
                          />
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                          <label className="_social_registration_label _mar_b8">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-control _social_registration_input"
                          />
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                          <label className="_social_registration_label _mar_b8">Password</label>
                          <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-control _social_registration_input"
                          />
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                          <label className="_social_registration_label _mar_b8">Repeat Password</label>
                          <input
                            type="password"
                            name="repeatPassword"
                            value={form.repeatPassword}
                            onChange={handleChange}
                            className="form-control _social_registration_input"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                        <div className="form-check _social_registration_form_check">
                          <input
                            className="form-check-input _social_registration_form_check_input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            defaultChecked
                          />
                          <label className="form-check-label _social_registration_form_check_label" htmlFor="flexRadioDefault2">
                            I agree to terms & conditions
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                        <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="_social_registration_form_btn_link _btn1"
                          >
                            {loading ? 'Creating account...' : 'Register now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_bottom_txt">
                        <p className="_social_registration_bottom_txt_para">
                          Already have an account?{" "}
                          <Link to="/">Login</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
