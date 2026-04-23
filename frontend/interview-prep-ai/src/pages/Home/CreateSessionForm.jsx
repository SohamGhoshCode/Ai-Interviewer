import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths';


const CreateSessionForm = () => {
    const [formData, setFormData] = useState({
        role: "",
        experience: "",
        topicsToFocus: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,

        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();

        const {role, experience, topicsToFocus} = formData;

        if(!role || !experience || !topicsToFocus){
            setError("Please fill all the required fields.");
            return;
        }

        setError("");
        setIsLoading(true);

        try{
            // Call AI API ton generate questions
            const aiResponse = await axiosInstance.post(
                API_PATHS.AI.GENERATE_QUESTIONS,
                {
                    role,
                    experience,
                    topicsToFocus,
                    numberOfQuestions: 10,
                }
            );

            // Should be array like [{question, answer}, ...]
            const generatedQuestions = aiResponse.data;

            const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
                ...formData,
                questions: generatedQuestions,

            });

            if(response.data?.session?._id){
                navigate(`/interview-prep/${response.data?.session?._id}`);
            }
        }
        catch(error){
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong.Please try again.");
            }
        } 
        finally{
            setIsLoading(false);
        }
    };
  return (
    <div className='w-[90vw] md:w-[38vw] flex flex-col'>
      {/* Header */}
      <div className='bg-black px-7 pt-7 pb-6 rounded-t-2xl'>
        <div className='flex items-center gap-2.5 mb-2'>
          <div className='w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center'>
            <span className='text-white text-sm'>✦</span>
          </div>
          <h3 className='text-[17px] font-bold text-white tracking-tight'>
            New Interview Session
          </h3>
        </div>
        <p className='text-[12px] text-white/50 leading-relaxed'>
          Fill in a few details and we'll generate personalized interview Q&A for you.
        </p>
      </div>

      {/* Form body */}
      <div className='px-7 py-6'>
        <form onSubmit={handleCreateSession} className='flex flex-col gap-1'>
          <Input
            value={formData.role}
            onChange={({ target }) => handleChange("role", target.value)}
            label="Target Role *"
            placeholder="e.g. Frontend Developer, UI/UX Designer"
            type="text"
          />
          <Input
            value={formData.experience}
            onChange={({ target }) => handleChange("experience", target.value)}
            label="Years of Experience *"
            placeholder="e.g. 1, 3, 5"
            type="number"
          />
          <Input
            value={formData.topicsToFocus}
            onChange={({ target }) => handleChange("topicsToFocus", target.value)}
            label="Topics to Focus On *"
            placeholder="e.g. React, Node.js, MongoDB"
            type="text"
          />
          <Input
            value={formData.description}
            onChange={({ target }) => handleChange("description", target.value)}
            label="Description (optional)"
            placeholder="Any specific goals or notes for this session"
            type="text"
          />

          {error && (
            <p className='text-red-500 text-xs py-1 flex items-center gap-1.5'>
              <span>⚠</span> {error}
            </p>
          )}

          <button
            type='submit'
            className='btn-primary w-full mt-3'
            disabled={isLoading}
          >
            {isLoading && <SpinnerLoader />}
            {isLoading ? 'Generating Questions...' : 'Generate & Start →'}
          </button>
        </form>
      </div>
    </div>
  );

};

export default CreateSessionForm
