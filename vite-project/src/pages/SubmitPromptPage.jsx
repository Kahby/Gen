import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

const SubmitPromptPage = () => {
  const { userEmail } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    teamNumber: '',
    registrationNumber: '',
    category: '',
    prompt: '',
    output: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'output') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear message when user starts typing
    if (submitMessage.text) {
      setSubmitMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      // Check if user is authenticated
      if (!userEmail) {
        setSubmitMessage({
          type: 'error',
          text: 'You must be logged in to submit a prompt.'
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('email', userEmail);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('teamNumber', formData.teamNumber);
      formDataToSend.append('registrationNumber', formData.registrationNumber);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('prompt', formData.prompt);
      
      // Append file if selected
      if (formData.output) {
        formDataToSend.append('output', formData.output);
      }

      // Send POST request to backend with FormData (for file upload)
      const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        method: 'POST',
        // Don't set Content-Type header - browser will set it with boundary for FormData
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to submit form');
      }

      const result = await response.json();

      // Success - reset form and show success message
      setFormData({
        fullName: '',
        teamNumber: '',
        registrationNumber: '',
        category: '',
        prompt: '',
        output: null,
      });
      
      setSubmitMessage({
        type: 'success',
        text: 'Prompt submitted successfully! Your submission is being analyzed and saved.'
      });

      console.log('Form submitted successfully:', result);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage({
        type: 'error',
        text: error.message || 'Failed to submit form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Prompt Analyzer Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <h1 className="text-5xl font-bold text-yellow-400">Prompt Analyzer</h1>
            </div>
            <p className="text-gray-300 text-lg mb-2">
              Submit your prompts and discover insights through advanced AI analysis.
            </p>
            <p className="text-gray-300 text-lg">
              Join the revolution of prompt engineering.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Submit Your Prompt</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              {/* Team Number and Registration Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Team number</label>
                  <input
                    type="text"
                    name="teamNumber"
                    value={formData.teamNumber}
                    onChange={handleChange}
                    placeholder="e.g. Team 10"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Registration number</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g. 24BCE"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>
              </div>

              {/* Prompt Category */}
              <div>
                <label className="block text-white mb-2">Prompt Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 appearance-none"
                  required
                >
                  <option value="">select your category</option>
                  <option value="meme">Meme Generation</option>
                  <option value="art">AI Visual Art</option>
                  <option value="storytelling">AI Digital Storytelling</option>
                  <option value="song">AI Song Factory</option>
                  <option value="poetry">AI-Generated Poetry</option>
                </select>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-white mb-2">Prompt</label>
                <textarea
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleChange}
                  rows="6"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none"
                  placeholder="Enter your prompt here..."
                  required
                />
              </div>

              {/* Your Output */}
              <div>
                <label className="block text-white mb-2">Your Output</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors">
                  <input
                    type="file"
                    name="output"
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                    accept=".mp3,.png,.jpg,.jpeg"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    upload your output
                  </label>
                  {formData.output && (
                    <p className="text-white mt-2 text-sm">{formData.output.name}</p>
                  )}
                </div>
              </div>

              {/* Submit Message */}
              {submitMessage.text && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.type === 'success'
                      ? 'bg-green-900 border border-green-700 text-green-300'
                      : 'bg-red-900 border border-red-700 text-red-300'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <PrimaryButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SubmitPromptPage;

