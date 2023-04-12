<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;

class ChangePasswordType_old extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
        ->add('old_password', PasswordType::class, [
            'label' => 'Mot de passe actuel',
            'mapped' => false,
            'attr' => [
                'placeholder' => 'Entrer le mot de passe actuel'
            ]
        ])
        ->add('new_password', RepeatedType::class, [
            'type' => PasswordType::class,
            'mapped' => false,
            'invalid_message' => 'Les mots de passe doivent être identiques',
            'label' => 'Nouveau mot de passe',
            'required' => true,
            'first_options' => [
                'label' => 'Nouveau mot de passe',
                'attr' => [
                    'placeholder' => 'Entrer le nouveau mot de passe'
                ]
            ],
            'second_options' => [
                'label' => 'Confirmer le nouveau mot de passe',
                'attr' => [
                    'placeholder' => 'Retaper le nouveau mot de passe'
                ]
            ]
        ])
        ->add('submit', SubmitType::class, [
            'label' => 'Modifier',
            'attr' => ['class' => 'btn-block btn-primary btn-sm']
        ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
