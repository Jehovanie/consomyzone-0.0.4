<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

class InscriptionPartenaireType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder

                // ->add('pseudo', TextType::class,array(
                //     'required' => false
                // ))
                ->add('num_rue', TextType::class)
                ->add('telephone', TelType::class,array(
                    'required' => false
                ))
                ->add('departement', HiddenType::class,array(
                    'required' => false
                ))
                // ->add('ville', TextType::class)

                ->add('code_postal', TextType::class, array(
                    'required' => true
                ))

                ->add("faux_commune", ChoiceType::class, array(
                    'required'   => true,
                    'empty_data' => '',
                ))

                ->add('nom_commune', HiddenType::class,array( 
                ))

                ->add('pays', TextType::class)

                ->add('faux_quartier', ChoiceType::class,array(
                    'required'   => true,
                    'empty_data' => '',
                ))
                ->add('profil', HiddenType::class)
                ->add('quartier', HiddenType::class)
                
                ->add('commerce', TextType::class,array(
                    'required' => true
                ))
                ->add('code_ape', TextType::class,array(
                    'required' => true
                ))

                ->add('site_web', TextType::class,array(
                    'required' => false
                ))
                ->add('facebook', TextType::class,array(
                    'required' => false
                ))
                ->add('linkedin', TextType::class,array(
                    'required' => false
                ))
                ->add('twitter', TextType::class,array(
                    'required' => false
                ))
                ->add('mail_pro', TextType::class,array(
                    'required' => false
                ))
                ->add('nomCommerce', TextType::class,array(
                    'required' => false
                ))
                ->add('siret', TextType::class,array(
                    'required' => false
                ))
                ->add('siren', TextType::class,array(
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
