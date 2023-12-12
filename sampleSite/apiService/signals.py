from . import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import librosa
import matplotlib.pyplot as plt
import os
from pathlib import Path
from django.conf import settings

@receiver(post_save, sender=models.Sample)
def generate_and_save_plot(sender, instance, **kwargs):
  if instance.audio_file:
    
    audio_file_path = Path(instance.audio_file.path)
    
    audio_data, _ = librosa.load(audio_file_path, sr=None, mono=True)
    
    plt.plot(audio_data, 'k')
    plt.axis('off')
    
    media_path = Path(settings.MEDIA_ROOT)
    plot_output_path =  media_path / 'plots' / f'plot_{instance.id}.png'
    
    plt.savefig(plot_output_path, bbox_inches='tight', pad_inches=0)
    plt.close()
    
    with open(plot_output_path, 'rb') as plot_file:
      instance.plot_image.save(plot_output_path.name, plot_file)
      
    instance.save()
    
post_save.connect(generate_and_save_plot, sender=models.Sample)