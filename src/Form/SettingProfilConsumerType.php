<?php

namespace App\Form;

use App\Entity\Consumer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class SettingProfilConsumerType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
        ->add('firstname', TextType::class, 
                ['label' => 'Prénom', 
                'attr' => [
                        'class' => 'form-control'
        ]])
        ->add('lastname', TextType::class, ['label' => 'Nom'])
        ->add('numRue', TextType::class, ['label' => 'N° de rue'])
        ->add('telephone', TelType::class, ['label' => 'Téléphone mobile'])
        // ->add('ville', TextType::class, ['label' => 'Ville'])
        ->add('codePostal', TextType::class, ['label' => 'Code postale'])
        ->add('pays', TextType::class, ['label' => 'Pays'])
        ->add('telFixe', TelType::class, ['label' => 'Téléphone fixe'])
        ->add('commune', TextType::class, ['label' => 'Commune'])
        ->add('submit', SubmitType::class, [
            'label' => 'Modifier',
            'attr' => ['class' => 'btn-block btn-primary btn-sm']
        ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Consumer::class,
        ]);
    }
}
