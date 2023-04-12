<?php

namespace App\Form;

use App\Entity\Supplier;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class SettingProfilSupplierType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstname', TextType::class, ['label' => 'Prénom'])
            ->add('lastname', TextType::class, ['label' => 'Nom'])
            ->add('numRue', TextType::class, ['label' => 'N° de rue'])
            ->add('telephone', TelType::class, ['label' => 'Téléphone mobile'])
            // ->add('ville', TextType::class, ['label' => 'Ville'])
            ->add('codePostal', TextType::class, ['label' => 'Code postale'])
            ->add('pays', TextType::class, ['label' => 'Pays'])
            ->add('telFixe', TelType::class, ['label' => 'Téléphone fixe'])
            // ->add('num_rue', TextType::class, ['label' => 'N° de rue'])
            // ->add('code_postal', TextType::class, ['label' => 'Code postale'])
            ->add('commune', TextType::class, ['label' => 'Ville'])
            // ->add('pays', TextType::class, ['label' => 'Pays'])
            ->add('commerce', TextType::class, ['label' => 'Commerce'])
            ->add('codeape', TextType::class, ['label' => 'Code APE'])
            ->add('website', TextType::class, ['label' => 'Site Web'])
            ->add('facebook', TextType::class, ['label' => 'Facebook'])
            ->add('twitter', TextType::class, ['label' => 'Twitter'])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Supplier::class,
        ]);
    }
}
