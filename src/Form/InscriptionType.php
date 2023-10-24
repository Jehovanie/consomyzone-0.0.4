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

class InscriptionType extends AbstractType
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
                    'required' => true
                ))
                ->add('prenom', TextType::class,array(
                    'required' => true
                ))
                // ->add('pseudo', TextType::class,array(
                //     'required' => false
                // ))
                ->add('num_rue', TextType::class)
                ->add('telephone', TelType::class,array(
                    'required' => true
                ))
                ->add('departement', HiddenType::class,array(
                    'required' => false
                ))
                // ->add('ville', TextType::class)

                ->add('code_postal', TextType::class, array(
                    'required' => true
                ))

                ->add("faux_commune", ChoiceType::class, array(
                    'required'   => false,
                    'empty_data' => '',
                ))

                ->add('nom_commune', HiddenType::class,array( 
                ))

                ->add('pays', TextType::class)

                ->add('faux_quartier', ChoiceType::class,array(
                    'required'   => false,
                    'empty_data' => '',
                ))

                ->add('quartier', HiddenType::class)
                
                ->add('commerce', TextType::class,array(
                    'required' => false
                ))
                ->add('code_ape', TextType::class,array(
                    'required' => false
                ))
                ->add('adresse', TextType::class,array(
                    'required' => false
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
                ->getForm();
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
        ]);
    }
}
