<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

class InscriptionFilleulType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
                ->add('Consommateur', CheckboxType::class,array(
                    'required' => false
                ))
                ->add('Fournisseur', HiddenType::class, array(
                    'required' => false,
                    'label' => 'Partenaire'
                ))
                
                ->add('profil', HiddenType::class) /// i do it later


                ->add('nom', TextType::class,array(
                    'required' => false
                ))
                ->add('prenom', TextType::class,array(
                    'required' => false
                ))
                ->add('telephone', TelType::class,array(
                    'required' => false
                ))
                ->add('pseudo', TelType::class,array(
                    'required' => false
                ))
                ->add('password', PasswordType::class,array(
                    'required' => false
                ))
                ->add('confirm_password', PasswordType::class,array(
                    'required' => false
                ))
                ->add('email', EmailType::class,array(
                    'required' => false
                ))
                ->getForm();
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
        ]);
    }
}
