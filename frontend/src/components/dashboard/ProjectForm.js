import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/api';

const EMPTY = {
  title: '',
  description: '',
  techStack: '',
  repoLink: '',
  liveLink: '',
  screenshot: '',
};

export default function ProjectForm({ project, onSaved, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title || '',
        description: project.description || '',
        techStack: (project.techStack || []).join(', '),
        repoLink: project.repoLink || '',
        liveLink: project.liveLink || '',
        screenshot: project.screenshot || '',
      });
    } else {
      reset(EMPTY);
    }
  }, [project, reset]);

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      techStack: formData.techStack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const response = project
      ? await api.put(`/projects/${project._id}`, payload)
      : await api.post('/projects', payload);

    reset(EMPTY);
    onSaved(response.data);
  };

  return (
    <form className="dashboard-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>{project ? 'Edit project' : 'Add a project'}</h2>

      <label>Title</label>
      <input {...register('title', { required: 'Title is required' })} />
      {errors.title && <span className="field-error">{errors.title.message}</span>}

      <label>Description</label>
      <textarea rows={2} {...register('description')} />

      <label>Tech stack (comma separated)</label>
      <input {...register('techStack')} placeholder="React, Node.js, MongoDB" />

      <label>Repo link</label>
      <input {...register('repoLink')} placeholder="https://github.com/..." />

      <label>Live link</label>
      <input {...register('liveLink')} placeholder="https://..." />

      <label>Screenshot URL</label>
      <input {...register('screenshot')} placeholder="https://..." />

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : project ? 'Update project' : 'Add project'}
        </button>

        {project && (
          <button type="button" className="secondary-button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
