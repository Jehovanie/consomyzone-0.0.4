<?php
namespace App\Form;

use App\Entity\FermeGeom;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AddEtabFermeModifFinType extends AbstractType{

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder

             ->add('accesHandicape', CheckboxType::class)
              ->add('accesHandicapAuditif', CheckboxType::class)
              ->add('accesHandicapMental', CheckboxType::class)
              ->add('accesHandicapMotrice', CheckboxType::class)
              ->add('accesHandicapVisuel', CheckboxType::class)
              ->add('accesVoiture', CheckboxType::class)
              ->add('adherentAdeve', CheckboxType::class)
              ->add('agricultureBio', CheckboxType::class)
              ->add('animauxAutoriser', CheckboxType::class)
              ->add('atelier', CheckboxType::class)
              ->add('carteBancaire', CheckboxType::class)
              ->add('chequeVacance', CheckboxType::class)
              ->add('degustation', CheckboxType::class)
              ->add('marcherProduit', CheckboxType::class)
              ->add('siteWeb', CheckboxType::class)
              ->add('stationVerte', CheckboxType::class)
              ->add('ticketsRestaurant', CheckboxType::class)
              ->add('venteEnLigne', CheckboxType::class);
            
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => FermeGeom::class,
        ]);
    }
}